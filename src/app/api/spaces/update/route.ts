/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server'
import {
  updateSpace
} from '@/lib/spaces/service'
import { createClient } from '@supabase/supabase-js'

/**
 * =========================================================
 * POST /api/spaces/update
 * =========================================================
 *
 * Updates an existing Space using edit_token.
 *
 * Security model:
 *
 * - edit_token acts as private ownership key
 * - no session required
 * - token must match an existing space
 *
 * Responsibilities:
 *
 * - parses request body
 * - validates payload through service layer
 * - updates space safely
 * - returns updated entity
 *
 * Used by:
 *
 * - live edit mode
 * - MCP tools
 * - admin automation
 * - future mobile apps
 *
 * =========================================================
 */
export async function POST(
  request: Request
) {
  try {
    // =====================================================
    // BODY
    // =====================================================
    const formData = await request.formData()
    const token = formData.get('token') as string | null
    const avatarFile = formData.get('avatar') as File | null
    const payloadStr = formData.get('payload') as string | null

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Missing edit token' },
        { status: 400 }
      )
    }

    const payload = payloadStr ? JSON.parse(payloadStr) : {}

    let finalAvatarUrl = payload.avatar_url

    // ====================== SUPABASE SERVER CLIENT ======================
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // ====================== HANDLE AVATAR DELETION ======================
    // Si l'utilisateur a supprimé l'avatar (avatar_url = null)
    if (finalAvatarUrl === null) {
      // On peut essayer de supprimer l'ancien fichier si on a l'ancienne URL
      const oldAvatarUrl = payload.avatar_url // ancienne valeur avant modification
      if (oldAvatarUrl && oldAvatarUrl.includes('supabase.co/storage')) {
        try {
          const url = new URL(oldAvatarUrl)
          const path = url.pathname.split('/storage/v1/object/public/')[1]
          if (path) {
            await supabase.storage.from('uploads_digitalid').remove([path])
          }
        } catch (deleteErr) {
          console.warn('Failed to delete old avatar file:', deleteErr)
          // On continue quand même la mise à jour
        }
      }
    }

    // ====================== HANDLE AVATAR UPLOAD ======================
    if (avatarFile) {
      const fileExt = avatarFile.name.split('.').pop()?.toLowerCase() || 'png'
      const fileName = `space-${Date.now()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('uploads_digitalid')
        .upload(filePath, avatarFile, {
          cacheControl: '3600',
          upsert: true,
        })

      if (uploadError) {
        console.error('Storage upload error:', uploadError)
        throw new Error('Failed to upload avatar')
      }

      const { data: urlData } = supabase.storage
        .from('uploads_digitalid')
        .getPublicUrl(filePath)

      finalAvatarUrl = urlData.publicUrl
    }

    // =====================================================
    // UPDATE
    // =====================================================
    const updatedSpace = await updateSpace(token, {
      ...payload,
      avatar_url: finalAvatarUrl
    })

    // =====================================================
    // RESPONSE
    // =====================================================
    return NextResponse.json({
      success: true,
      space: updatedSpace
    })

  } catch (err: any) {
    console.error('SPACE UPDATE ERROR:', err)

    if (err?.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: err.errors?.[0]?.message || 'Invalid payload' },
        { status: 400 }
      )
    }

    if (err?.message === 'Space not found') {
      return NextResponse.json(
        { success: false, error: 'Space not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { success: false, error: err?.message || 'Unknown server error' },
      { status: 500 }
    )
  }
}
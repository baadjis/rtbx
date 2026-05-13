/* eslint-disable @typescript-eslint/no-explicit-any */

import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { NextResponse } from 'next/server'

import { getSpaceWelcomeEmail } from '@/utils/email-templates'

const resend = new Resend(
  process.env.RESEND_API_KEY
)

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(
  request: Request
) {

  try {

    const body = await request.json()

    // =====================================================
    // BASIC VALIDATION
    // =====================================================

    if (!body.email) {

      return NextResponse.json(
        {
          error: 'Email is required'
        },
        {
          status: 400
        }
      )

    }

    if (!body.space_type) {

      return NextResponse.json(
        {
          error: 'Space type is required'
        },
        {
          status: 400
        }
      )

    }

    if (!body.slug) {

      return NextResponse.json(
        {
          error: 'Slug is required'
        },
        {
          status: 400
        }
      )

    }

    // =====================================================
    // CLEAN DATA
    // =====================================================

    const cleanEmail =
      body.email
        .toLowerCase()
        .trim()

    const cleanSlug =
      body.slug
        .toLowerCase()
        .trim()

    // =====================================================
    // CHECK EXISTING SLUG
    // =====================================================

    const {
      data: existingSpace
    } = await supabaseAdmin
      .from('spaces')
      .select('id')
      .eq('slug', cleanSlug)
      .maybeSingle()

    if (existingSpace) {

      return NextResponse.json(
        {
          error:
            body.lang === 'fr'
              ? 'Ce lien public existe déjà'
              : 'This public link already exists'
        },
        {
          status: 409
        }
      )

    }

    // =====================================================
    // INSERT SPACE
    // =====================================================

    const insertPayload = {

      user_id:
        body.user_id || null,

      email: cleanEmail,

      slug: cleanSlug,

      space_type:
        body.space_type || 'personal',

      space_subtype:
        body.space_subtype || null,

      entity_name:
        body.entity_name || null,

      social_data:
        body.social_data || [],

      theme_color:
        body.theme_color || '#4f46e5',

      avatar_url:
        body.avatar_url || null,

      legal_accepted_at:
        body.legal_accepted_at ||
        new Date().toISOString(),

      is_authorized_representative:
        body.is_authorized_representative || false,

      

    }

    const {
      data,
      error
    } = await supabaseAdmin
      .from('spaces')
      .insert([insertPayload])
      .select(`
        id,
        slug,
        edit_token,
        entity_name,
        email,
        space_type
      `)
      .single()

    if (error) {
      throw error
    }

    // =====================================================
    // FALLBACK SECURITY
    // =====================================================

    if (!data?.edit_token) {

      console.error(
        'Missing edit_token after insert'
      )

      return NextResponse.json(
        {
          error:
            'Missing edit token'
        },
        {
          status: 500
        }
      )

    }

    // =====================================================
    // DISPLAY NAME
    // =====================================================

    const displayName =

      data.entity_name ||

      cleanSlug ||

      cleanEmail

    // =====================================================
    // URLS
    // =====================================================

    const publicUrl =
      `https://www.rtbx.space/u/${data.slug}`

    const onboardingUrl =
      `https://www.rtbx.space/u/${data.slug}/onboarding`

    const editUrl =
      `https://www.rtbx.space/edit/space?token=${data.edit_token}`

    // =====================================================
    // EMAIL TEMPLATE
    // =====================================================

    const htmlContent =
      getSpaceWelcomeEmail(
        {
          displayName,

          slug:
            data.slug,
          

          spaceId:
            data.id,

          publicUrl,

          onboardingUrl,

          editUrl
        },
        body.lang
      )

    // =====================================================
    // SEND EMAIL
    // =====================================================

    try {

      await resend.emails.send({

        from:
          'RetailBox Space <hello@rtbx.space>',

        to:
          cleanEmail,

        subject:
          body.lang === 'fr'
            ? 'Votre espace est prêt'
            : 'Your space is ready',

        html:
          htmlContent

      })

    } catch (mailError) {

      console.error(
        'EMAIL ERROR:',
        mailError
      )

    }

    // =====================================================
    // RESPONSE
    // =====================================================

    return NextResponse.json({

      success: true,

      id:
        data.slug || data.id,

      slug:
        data.slug,

      onboarding_url:
        onboardingUrl,

      public_url:
        publicUrl

    })

  } catch (err: any) {

    console.error(
      'API Activation Error:',
      err
    )

    return NextResponse.json(
      {
        error:
          err?.message ||
          'Unknown error'
      },
      {
        status: 500
      }
    )

  }

}
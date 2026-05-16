/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from 'next/server'

import {
  updateSpace
} from '@/lib/spaces/service'

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

    const body = await request.json()

    // =====================================================
    // TOKEN
    // =====================================================

    const token =
      body.token

    if (!token) {

      return NextResponse.json(
        {
          success: false,

          error:
            'Missing edit token'
        },
        {
          status: 400
        }
      )

    }

    // =====================================================
    // UPDATE
    // =====================================================

    const updatedSpace =
      await updateSpace(
        token,
        {

          entity_name:
            body.entity_name,

          social_data:
            body.social_data,

          theme_color:
            body.theme_color,

          bg_color:
            body.bg_color,

          updated_at:
            new Date().toISOString()
        }
      )

    // =====================================================
    // RESPONSE
    // =====================================================

    return NextResponse.json({

      success: true,

      space:
        updatedSpace

    })

  } catch (err: any) {

    console.error(
      'SPACE UPDATE ERROR:',
      err
    )

    // =====================================================
    // ZOD VALIDATION
    // =====================================================

    if (
      err?.name === 'ZodError'
    ) {

      return NextResponse.json(
        {
          success: false,

          error:
            err.errors?.[0]?.message ||
            'Invalid payload'
        },
        {
          status: 400
        }
      )

    }

    // =====================================================
    // NOT FOUND
    // =====================================================

    if (
      err?.message ===
      'Space not found'
    ) {

      return NextResponse.json(
        {
          success: false,

          error:
            'Space not found'
        },
        {
          status: 404
        }
      )

    }

    // =====================================================
    // GENERIC ERROR
    // =====================================================

    return NextResponse.json(
      {
        success: false,

        error:
          err?.message ||
          'Unknown server error'
      },
      {
        status: 500
      }
    )

  }

}
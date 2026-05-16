/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from 'next/server'

import {
  getSpaceByToken
} from '@/lib/spaces/service'

/**
 * =========================================================
 * GET /api/spaces/by-token
 * =========================================================
 *
 * Retrieves a Space using edit_token.
 *
 * Security:
 *
 * - private route
 * - edit_token required
 *
 * Used by:
 *
 * - edit pages
 * - MCP tools
 * - automation
 *
 * Example:
 *
 * /api/spaces/by-token?token=xxxxx
 *
 * =========================================================
 */

export async function GET(
  request: Request
) {

  try {

    // =====================================================
    // URL
    // =====================================================

    const { searchParams } =
      new URL(request.url)

    // =====================================================
    // TOKEN
    // =====================================================

    const token =
      searchParams.get('token')

    if (!token) {

      return NextResponse.json(
        {
          success: false,

          error:
            'Missing token'
        },
        {
          status: 400
        }
      )

    }

    // =====================================================
    // FETCH
    // =====================================================

    const space =
      await getSpaceByToken(token)

    // =====================================================
    // NOT FOUND
    // =====================================================

    if (!space) {

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
    // RESPONSE
    // =====================================================

    return NextResponse.json({

      success: true,

      space

    })

  } catch (err: any) {

    console.error(
      'GET SPACE BY TOKEN ERROR:',
      err
    )

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
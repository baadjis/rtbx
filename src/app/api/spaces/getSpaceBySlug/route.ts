/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from 'next/server'

import {
  getSpaceBySlug
} from '@/lib/spaces/service'

/**
 * =========================================================
 * GET /api/spaces/by-slug
 * =========================================================
 *
 * Retrieves a public Space using slug.
 *
 * Security:
 *
 * - public route
 * - safe for frontend usage
 *
 * Used by:
 *
 * - public profile pages
 * - previews
 * - MCP tools
 * - embeds
 *
 * Example:
 *
 * /api/spaces/by-slug?slug=my-space
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
    // SLUG
    // =====================================================

    const slug =
      searchParams.get('slug')

    if (!slug) {

      return NextResponse.json(
        {
          success: false,

          error:
            'Missing slug'
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
      await getSpaceBySlug(slug)

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
      'GET SPACE BY SLUG ERROR:',
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
/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from 'next/server'

import {
  deleteSpace
} from '@/lib/spaces/service'

/**
 * =========================================================
 * POST /api/spaces/delete
 * =========================================================
 *
 * Deletes a Space using edit_token.
 *
 * Security model:
 *
 * - edit_token acts as ownership key
 * - no authenticated session required
 * - token must belong to an existing space
 *
 * Responsibilities:
 *
 * - parses request body
 * - validates edit token
 * - deletes the space safely
 * - returns success state
 *
 * Used by:
 *
 * - edit mode
 * - MCP tools
 * - admin tools
 * - automation workflows
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
    // DELETE
    // =====================================================

    await deleteSpace(token)

    // =====================================================
    // RESPONSE
    // =====================================================

    return NextResponse.json({

      success: true

    })

  } catch (err: any) {

    console.error(
      'SPACE DELETE ERROR:',
      err
    )

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
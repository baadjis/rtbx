/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from 'next/server'

import { requireUser }
from '@/lib/auth/get-user'

import { createClient }
from '@/utils/supabase/server'

/**
 * =========================================================
 * GET /api/businesses/[id]/loyalty-history
 * =========================================================
 *
 * Returns latest loyalty scans.
 *
 * MCP Friendly
 * Mobile Friendly
 * =========================================================
 */
export async function GET(
  request: Request,
  {
    params
  }: {
    params: Promise<{
      id: string
    }>
  }
) {

  try {

    const {
      user,
      error: err
    } =
      await requireUser(
        request
      )

    if (!user) {

      return NextResponse.json(
        {
          success: false,
          error: err
        },
        {
          status: 401
        }
      )

    }

    const {
      id
    } = await params

    const supabase =
      await createClient()

    const {
      data,
      error
    } = await supabase

      .from(
        'loyalty_history'
      )

      .select('*')

      .eq(
        'business_id',
        Number(id)
      )

      .order(
        'created_at',
        {
          ascending: false
        }
      )

      .limit(50)

    if (error) {

      return NextResponse.json(
        {
          success: false,
          error
        },
        {
          status: 400
        }
      )

    }

    return NextResponse.json({

      success: true,

      data

    })

  } catch (err: any) {

    console.error(
      'LOYALTY_HISTORY_ERROR',
      err
    )

    return NextResponse.json(
      {
        success: false,
        error:
          'Internal server error'
      },
      {
        status: 500
      }
    )

  }

}
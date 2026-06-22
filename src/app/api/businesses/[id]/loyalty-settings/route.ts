/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from 'next/server'

import { requireUser }
from '@/lib/auth/get-user'

import {

  getBusinessLoyaltySettings,

  saveBusinessLoyaltySettings

} from '@/lib/business-loyalty/service'

/**
 * =========================================================
 * GET /api/businesses/[id]/loyalty-settings
 * =========================================================
 *
 * Returns loyalty settings
 * for a business.
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

    const {
      data,
      error
    } =
      await getBusinessLoyaltySettings(
        Number(id)
      )

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
      'LOYALTY_SETTINGS_GET_ERROR',
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

/**
 * =========================================================
 * PUT /api/businesses/[id]/loyalty-settings
 * =========================================================
 *
 * Updates loyalty settings
 * for a business.
 *
 * MCP Friendly
 * Mobile Friendly
 * =========================================================
 */
export async function PUT(
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

    const body =
      await request.json()

    const {
      data,
      error
    } =
      await saveBusinessLoyaltySettings({

        business_id:
          Number(id),

        ...body

      })

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
      'LOYALTY_SETTINGS_SAVE_ERROR',
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
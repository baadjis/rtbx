/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from 'next/server'

import { requireUser }
from '@/lib/auth/get-user'

import {

  getBusinessLoyaltyRewards,

  createBusinessLoyaltyReward

} from '@/lib/business-loyalty/service'

/**
 * =========================================================
 * GET /api/businesses/[id]/loyalty-rewards
 * =========================================================
 *
 * Returns all rewards
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
      await getBusinessLoyaltyRewards(
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
      'LOYALTY_REWARDS_GET_ERROR',
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
 * POST /api/businesses/[id]/loyalty-rewards
 * =========================================================
 *
 * Creates a reward.
 *
 * MCP Friendly
 * Mobile Friendly
 * =========================================================
 */
export async function POST(
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
      await createBusinessLoyaltyReward({

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
      'LOYALTY_REWARD_CREATE_ERROR',
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
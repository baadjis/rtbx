/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from 'next/server'

import { requireUser }
from '@/lib/auth/get-user'

import {

  updateBusinessLoyaltyReward,

  deleteBusinessLoyaltyReward

} from '@/lib/business-loyalty/service'

/**
 * =========================================================
 * PUT /api/businesses/[id]/loyalty-rewards/[rewardId]
 * =========================================================
 *
 * Updates a reward.
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
      rewardId: string
    }>
  }
) {

  try {

    const {
      user,
      error: err
    } = await requireUser(
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
      rewardId
    } = await params

    const body =
      await request.json()

    const {
      data,
      error
    } =
      await updateBusinessLoyaltyReward(

        Number(rewardId),

        body

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
      'LOYALTY_REWARD_UPDATE_ERROR',
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
 * DELETE /api/businesses/[id]/loyalty-rewards/[rewardId]
 * =========================================================
 *
 * Deletes a reward.
 *
 * MCP Friendly
 * Mobile Friendly
 * =========================================================
 */
export async function DELETE(
  request: Request,
  {
    params
  }: {
    params: Promise<{
      id: string
      rewardId: string
    }>
  }
) {

  try {

    const {
      user,
      error: err
    } = await requireUser(
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
      rewardId
    } = await params

    const {
      error
    } =
      await deleteBusinessLoyaltyReward(
        Number(rewardId)
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

      success: true

    })

  } catch (err: any) {

    console.error(
      'LOYALTY_REWARD_DELETE_ERROR',
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
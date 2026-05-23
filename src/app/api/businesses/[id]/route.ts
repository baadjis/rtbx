/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server'


import {
  updateBusiness,
  deleteBusiness,
  getBusiness
} from '@/lib/businesses/service'
import { requireUser } from '@/lib/auth/get-user'

/**
 * =========================================================
 * GET /api/businesses/[id]
 * =========================================================
 *
 * Retrieves a single business by ID.
 * =========================================================
 */
export async function GET(
  request: Request,
  context: {
    params: Promise<{
      id: string
    }>
  }
) {
  try {

    const { id } =
      await context.params

    const {
  user,
  error:err
} = await requireUser()

if (!user) {

  return NextResponse.json(
    {
      success: false,
      err
    },
    {
      status: 401
    }
  )

}

    const {
      data,
      error
    } = await getBusiness(id,user.id)

    if (
      error ||
      !data
    ) {

      return NextResponse.json(
        {
          success: false,
          error:
            error ||
            'Business not found'
        },
        {
          status: 404
        }
      )

    }

    return NextResponse.json({
      success: true,
      data
    })

  } catch (err: any) {

    console.error(
      'BUSINESS_GET_ERROR:',
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
 * PATCH /api/businesses/[id]
 * =========================================================
 *
 * Updates an existing business.
 * =========================================================
 */
export async function PATCH(
  request: Request,
  context: {
    params: Promise<{
      id: string
    }>
  }
) {
  try {

     const {
  user,
  error:err
} = await requireUser()

if (!user) {

  return NextResponse.json(
    {
      success: false,
      err
    },
    {
      status: 401
    }
  )

}


    const { id } =
      await context.params

    const body =
      await request.json()

    const {
      data,
      error
    } = await updateBusiness(
      id,
      user.id,
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
      'BUSINESS_UPDATE_ERROR:',
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
 * DELETE /api/businesses/[id]
 * =========================================================
 *
 * Permanently deletes a business.
 * =========================================================
 */
export async function DELETE(
  request: Request,
  context: {
    params: Promise<{
      id: string
    }>
  }
) {
  try {

     const {
  user,
  error:err
} = await requireUser()

if (!user) {

  return NextResponse.json(
    {
      success: false,
      err
    },
    {
      status: 401
    }
  )

}


    const { id } =
      await context.params

    const {
      error
    } = await deleteBusiness(id,user.id)

    if (error) {

      return NextResponse.json(
        {
          success: false,
          error:
            error ||
            'Failed to delete business'
        },
        {
          status: 400
        }
      )

    }

    return NextResponse.json({
      success: true,
      message:
        'Business deleted successfully'
    })

  } catch (err: any) {

    console.error(
      'BUSINESS_DELETE_ERROR:',
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
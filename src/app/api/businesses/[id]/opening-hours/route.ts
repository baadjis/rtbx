/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from 'next/server'

import { requireUser }
from '@/lib/auth/get-user'

import {
    getBusinessOpeningHours,
  saveBusinessOpeningHours
} from '@/lib/business-opening-hours/service'

/**
 * =========================================================
 * PUT /api/businesses/[id]/opening-hours
 * =========================================================
 *
 * Save opening hours
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
      hours
    } = body

    const {
      data,
      error
    } =
      await saveBusinessOpeningHours(

        Number(id),

        hours

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

      'OPENING_HOURS_ERROR',

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
 * GET /api/businesses/[id]/opening-hours
 * =========================================================
 *
 * get opening hours of a given business
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
      await getBusinessOpeningHours(

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

      'OPENING_HOURS_ERROR',

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
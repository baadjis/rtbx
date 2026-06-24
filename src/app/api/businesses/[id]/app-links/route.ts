/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from 'next/server'

import { requireUser }
from '@/lib/auth/get-user'

import {
  getBusinessAppLinks,
  upsertBusinessAppLink
} from '@/lib/business-app-links/service'

/**
 * =========================================================
 * GET /api/businesses/[id]/app-links
 * =========================================================
 *
 * Returns all configured app links
 * for a business.
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
          success:false,
          error:err
        },
        {
          status:401
        }
      )

    }

    const { id } =
      await params

    const {
      data,
      error
    } =
      await getBusinessAppLinks(
        Number(id)
      )

    if (error) {

      return NextResponse.json(
        {
          success:false,
          error
        },
        {
          status:400
        }
      )

    }

    return NextResponse.json({

      success:true,

      data

    })

  } catch (err:any) {

    console.error(err)

    return NextResponse.json(

      {

        success:false,

        error:
          'Internal server error'

      },

      {

        status:500

      }

    )

  }

}


/**
 * =========================================================
 * POST /api/businesses/[id]/app-links
 * =========================================================
 *
 * Creates or updates
 * an app provider link.
 * =========================================================
 */

export async function POST(
  request: Request,
  {
    params
  }: {
    params: Promise<{
      id:string
    }>
  }
) {

  try {

    const {
      user,
      error:err
    } =
      await requireUser(
        request
      )

    if (!user) {

      return NextResponse.json(
        {
          success:false,
          error:err
        },
        {
          status:401
        }
      )

    }

    const { id } =
      await params

    const body =
      await request.json()

    const {
      data,
      error
    } =
      await upsertBusinessAppLink({

        business_id:
          Number(id),

        provider_id:
          body.provider_id,

        value:
          body.value

      })

    if (error) {

      return NextResponse.json(
        {
          success:false,
          error
        },
        {
          status:400
        }
      )

    }

    return NextResponse.json({

      success:true,

      data

    })

  } catch (err:any) {

    console.error(err)

    return NextResponse.json(

      {

        success:false,

        error:
          'Internal server error'

      },

      {

        status:500

      }

    )

  }

}
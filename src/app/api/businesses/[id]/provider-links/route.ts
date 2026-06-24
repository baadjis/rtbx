/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from 'next/server'

import { requireUser }
from '@/lib/auth/get-user'

import {
    getBusinessProviderLinks,
  upsertBusinessProviderLink
} from '@/lib/business-provider-links/service'

/**
 * =========================================================
 * POST /api/businesses/[id]/provider-links
 * =========================================================
 *
 * Create / Update provider link
 * for authenticated user business
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
      await upsertBusinessProviderLink({

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

      'PROVIDER_LINK_ERROR',

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
 * POST /api/businesses/[id]/provider-links
 * =========================================================
 *
 * get  provider links
 * for authenticated user business
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
      await getBusinessProviderLinks(
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

      'PROVIDER_LINK_ERROR',

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
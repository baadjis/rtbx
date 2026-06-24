/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from 'next/server'

import { requireUser }
from '@/lib/auth/get-user'

import {
  deleteBusinessAppLink
} from '@/lib/business-app-links/service'

/**
 * =========================================================
 * DELETE /api/businesses/[id]/app-links/[linkId]
 * =========================================================
 *
 * Deletes an app provider link.
 * =========================================================
 */

export async function DELETE(
  request: Request,
  {
    params
  }: {
    params: Promise<{

      id:string

      linkId:string

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

    const {
      linkId
    } =
      await params

    const {
      error
    } =
      await deleteBusinessAppLink(
        Number(linkId)
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

      success:true

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
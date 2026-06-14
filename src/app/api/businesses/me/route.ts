/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from 'next/server'

import {
  
  getUserBusinesses
} from '@/lib/businesses/service'


import { requireUser } from '@/lib/auth/get-user'

/**
 * =========================================================
 * GET /api/businesses
 * =========================================================
 *
 * Retrieves all businesses
 * for the authenticated user.
 * =========================================================
 */
export async function GET(request:Request) {

  try {

     const {
      user,
      error:err
    } = await requireUser(request)
    
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
    } = await getUserBusinesses(
      user.id
    )

    if (error) {

      return NextResponse.json(
        {
          success: false,
          error:
            error ||
            'Failed to fetch businesses'
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
      'BUSINESSES_GET_ERROR:',
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
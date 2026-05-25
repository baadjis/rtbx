/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/shortener/route.ts
import { NextResponse } from 'next/server';
import {
  createLink,
  getUserLinks
} from '@/lib/shortener/service';
import { requireUser } from '@/lib/auth/get-user';

/**
 * =========================================================
 * GET /api/shortener
 * =========================================================
 *
 * Retrieves all shortened links for the authenticated user.
 * =========================================================
 */
export async function GET() {
  try {
    const {
      user,
      error: authError
    } = await requireUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: authError
        },
        {
          status: 401
        }
      );
    }

    const {
      data,
      error
    } = await getUserLinks(user.id);

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: error || 'Failed to fetch links'
        },
        {
          status: 400
        }
      );
    }

    return NextResponse.json({
      success: true,
      data
    });

  } catch (err: any) {
    console.error('SHORTENER_GET_ERROR:', err);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      {
        status: 500
      }
    );
  }
}

/**
 * =========================================================
 * POST /api/shortener
 * =========================================================
 *
 * Creates a new shortened URL.
 * =========================================================
 */
export async function POST(request: Request) {
  try {
    const {
      user,
      error: authError
    } = await requireUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: authError
        },
        {
          status: 401
        }
      );
    }

    const body = await request.json();

    const {
      data,
      error
    } = await createLink({
      ...body,
      user_id: user.id
    });

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error
        },
        {
          status: 400
        }
      );
    }

    return NextResponse.json({
      success: true,
      data
    });

  } catch (err: any) {
    console.error('SHORTENER_CREATE_ERROR:', err);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      {
        status: 500
      }
    );
  }
}
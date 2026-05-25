/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/shortener/[code]/route.ts
import { NextResponse } from 'next/server';
import {
  getLinkByCode,
  deleteLink,
  incrementClicks,
  updateLink
} from '@/lib/shortener/service';
import { requireUser } from '@/lib/auth/get-user';

/**
 * =========================================================
 * GET /api/shortener/[code]
 * =========================================================
 *
 * Retrieves a shortened link by its short code and increments clicks.
 * =========================================================
 */
export async function GET(
  request: Request,
  context: {
    params: Promise<{
      code: string
    }>
  }
) {

  try {
    const { code } =
      await context.params
    // Increment clicks (public action, no auth required)
    await incrementClicks(code);

    const { data, error } = await getLinkByCode(code);

    if (error || !data) {
      return NextResponse.json({
        success: false,
        error: 'Link not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data
    });

  } catch (err: any) {
    console.error('SHORTENER_GET_ERROR:', err);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
/**
 * =========================================================
 * PATCH /api/shortener/[code]
 * =========================================================
 *
 * Updates title and description of a shortened link.
 * =========================================================
 */
export async function PATCH(
  request: Request,

context: {
    params: Promise<{
      code: string
    }>}) {
  try {

    const { code } =
      await context.params
    const {
      user,
      error: authError
    } = await requireUser();

    if (!user) {
      return NextResponse.json({
        success: false,
        error: authError
      }, { status: 401 });
    }

    const body = await request.json();

    const { data, error } = await updateLink(code, body);

    if (error) {
      return NextResponse.json({
        success: false,
        error
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data
    });

  } catch (err: any) {
    console.error('SHORTENER_UPDATE_ERROR:', err);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

/**
 * =========================================================
 * DELETE /api/shortener/[code]
 * =========================================================
 *
 * Soft deletes a shortened link.
 * =========================================================
 */
export async function DELETE(
  request: Request,
  { params }: { params: { code: string } }
) {
  try {
    const {
      user,
      error: authError
    } = await requireUser();

    if (!user) {
      return NextResponse.json({
        success: false,
        error: authError
      }, { status: 401 });
    }

    const { error } = await deleteLink(params.code);

    if (error) {
      return NextResponse.json({
        success: false,
        error
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Link deleted successfully'
    });

  } catch (err: any) {
    console.error('SHORTENER_DELETE_ERROR:', err);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}


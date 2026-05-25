/* eslint-disable @typescript-eslint/no-explicit-any */
import { requireUser } from "@/lib/auth/get-user";
import { getLinkStats } from "@/lib/shortener/service";
import { NextResponse } from "next/server";

/**
 * =========================================================
 * GET /api/shortener/[code]/stats
 * =========================================================
 *
 * Retrieves statistics for a shortened link.
 * =========================================================
 */
export async function GET_STATS(
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

    const { data, error } = await getLinkStats(params.code);

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
    console.error('SHORTENER_STATS_ERROR:', err);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
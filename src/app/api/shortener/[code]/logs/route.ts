/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/shortener/[code]/logs/route.ts
import { NextResponse } from 'next/server';
import { getLinkLogs } from '@/lib/shortener/service';
import { requireUser } from '@/lib/auth/get-user';

/**
 * =========================================================
 * GET /api/shortener/[code]/logs
 * =========================================================
 *
 * Retrieves click logs for a shortened link.
 * =========================================================
 */
export async function GET(
  request: Request,
  context: {
    params: Promise<{
      code: string
      
    }>}
) {
  try {
    const { code  }=await context.params

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

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');

    const { data, error } = await getLinkLogs(code, limit);

    if (error) {
      return NextResponse.json({
        success: false,
        error: error || 'Failed to fetch logs'
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data
    });

  } catch (err: any) {
    console.error('SHORTENER_LOGS_ERROR:', err);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
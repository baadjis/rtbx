/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/events/publish/route.ts
import { NextResponse } from 'next/server';
import { publishEvent } from '@/lib/events/service';
import { requireUser } from '@/lib/auth/get-user';

/**
 * =========================================================
 * POST /api/events/publish
 * =========================================================
 *
 * Publishes an event and sends pending invitations if any.
 *
 * Security model:
 * - Requires authenticated user (must be the organizer)
 * - Automatically sends invitation emails via Resend
 *
 * Used by:
 * - Frontend event publishing interface
 * - MCP Agent (publishEvent tool)
 * - Automation workflows
 * =========================================================
 */
export async function POST(request: Request) {
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

    const body = await request.json();

    const { data, error } = await publishEvent({
      ...body,
      organizer_id: user.id
    });

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
    console.error('EVENT_PUBLISH_ERROR:', err);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
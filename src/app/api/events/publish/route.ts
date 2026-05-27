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
 * Publishes a draft event and sends pending invitations.
 *
 * Responsibilities:
 *
 * - requires authenticated user (must be the organizer)
 * - validates eventId and lang
 * - sets is_published to true
 * - fetches pending invitations for this event
 * - sends invitation emails via Resend
 * - updates invitation statuses to 'sent'
 * - returns event data and invitation count
 *
 * This route is safe to expose to:
 *
 * - frontend event dashboard
 * - MCP tools (publishEvent)
 * - automation flows
 *
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
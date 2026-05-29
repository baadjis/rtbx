/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { sendBadges } from '@/lib/events/service';
import { requireUser } from '@/lib/auth/get-user';

/**
 * =========================================================
 * POST /api/events/send-badges
 * =========================================================
 *
 * Sends badge PDFs to all registered participants of an event.
 *
 * Responsibilities:
 *
 * - requires authenticated user (must be the organizer)
 * - validates eventId and lang
 * - verifies organizer ownership of the event
 * - fetches all badges joined with registrations
 * - calls Python API to generate badge PDF per participant
 * - sends badge email with PDF attachment via Resend
 * - marks each badge as sent in event_badges
 * - returns sent/failed counts
 *
 * This route is safe to expose to:
 *
 * - frontend event management dashboard
 * - MCP tools (sendBadges)
 * - post-event automation flows
 *
 * =========================================================
 */

export async function POST(request: Request) {
  try {
    const { user, error: authError } = await requireUser(request);
    if (!user) return NextResponse.json({ success: false, error: authError }, { status: 401 });

    const body = await request.json();
    const { data, error } = await sendBadges({ ...body, organizer_id: user.id });

    if (error) return NextResponse.json({ success: false, error }, { status: 400 });
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('EVENT_SEND_BADGES_ERROR:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
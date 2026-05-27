/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * =========================================================
 * POST /api/events/[id]/cancel
 * =========================================================
 *
 * Cancels a published event and notifies all contacts.
 *
 * Responsibilities:
 *
 * - requires authenticated user (must be the organizer)
 * - verifies organizer ownership
 * - blocks cancellation if event is not published
 * - sets event status to 'cancelled'
 * - merges registered and invited email lists (no duplicates)
 * - sends cancellation email to all contacts with optional reason
 * - returns cancelled confirmation and notified count
 *
 * Note: to delete a draft event, use DELETE /api/events/[id]
 *
 * This route is safe to expose to:
 *
 * - frontend event management dashboard
 * - MCP tools (cancelEvent)
 * - automation flows
 *
 * =========================================================
 */
import { NextResponse } from 'next/server';
import { cancelEvent } from '@/lib/events/service';
import { requireUser } from '@/lib/auth/get-user';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { user, error: authError } = await requireUser();
    if (!user) return NextResponse.json({ success: false, error: authError }, { status: 401 });

    const body = await request.json();
    const { data, error } = await cancelEvent({
      ...body,
      eventId: params.id,
      organizer_id: user.id,
    });

    if (error) return NextResponse.json({ success: false, error }, { status: 400 });
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('EVENT_CANCEL_ERROR:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
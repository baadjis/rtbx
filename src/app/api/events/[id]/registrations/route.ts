/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * =========================================================
 * GET /api/events/[id]/registrations
 * =========================================================
 *
 * Returns all registrations for a specific event.
 *
 * Responsibilities:
 *
 * - requires authenticated user (must be the organizer)
 * - verifies organizer ownership of the event
 * - returns full registration list ordered by created_at desc
 *
 * This route is safe to expose to:
 *
 * - frontend event dashboard (participants list)
 * - MCP tools (getEventRegistrations)
 * - export/reporting flows
 *
 * =========================================================
 */
import { NextResponse } from 'next/server';
import { getEventRegistrations } from '@/lib/events/service';
import { requireUser } from '@/lib/auth/get-user';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const {id} = await params

    const { user, error: authError } = await requireUser();
    if (!user) return NextResponse.json({ success: false, error: authError }, { status: 401 });

    const { data, error } = await getEventRegistrations(id, user.id);

    if (error) return NextResponse.json({ success: false, error }, { status: 400 });
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('EVENT_REGISTRATIONS_ERROR:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
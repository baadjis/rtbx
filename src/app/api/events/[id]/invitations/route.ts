/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * =========================================================
 * GET /api/events/[id]/invitations
 * =========================================================
 *
 * Returns all invitations sent for a specific event.
 *
 * Responsibilities:
 *
 * - requires authenticated user (must be the organizer)
 * - verifies organizer ownership of the event
 * - returns full invitation list ordered by created_at desc
 *
 * This route is safe to expose to:
 *
 * - frontend guest management interface
 * - MCP tools (getEventInvitations)
 * - automation flows
 *
 * =========================================================
 */
import { NextResponse } from 'next/server';
import { getEventInvitations } from '@/lib/events/service';
import { requireUser } from '@/lib/auth/get-user';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { user, error: authError } = await requireUser();
    if (!user) return NextResponse.json({ success: false, error: authError }, { status: 401 });

    const { data, error } = await getEventInvitations(params.id, user.id);

    if (error) return NextResponse.json({ success: false, error }, { status: 400 });
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('EVENT_INVITATIONS_ERROR:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
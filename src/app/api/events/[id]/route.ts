/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { updateEvent, deleteEvent } from '@/lib/events/service';
import { requireUser } from '@/lib/auth/get-user';

/**
 * =========================================================
 * PATCH /api/events/[id]
 * =========================================================
 *
 * Updates an existing event for the authenticated organizer.
 *
 * Responsibilities:
 *
 * - requires authenticated user (must be the organizer)
 * - validates partial update payload
 * - verifies organizer ownership
 * - updates editable fields only
 * - returns updated event
 *
 * This route is safe to expose to:
 *
 * - frontend event edit form
 * - MCP tools (updateEvent)
 * - automation flows
 *
 * =========================================================
 **/
 
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { user, error: authError } = await requireUser();
    if (!user) return NextResponse.json({ success: false, error: authError }, { status: 401 });

    const body = await request.json();
    const { data, error } = await updateEvent(params.id, body, user.id);

    if (error) return NextResponse.json({ success: false, error }, { status: 400 });
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('EVENT_UPDATE_ERROR:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}


/** 
* =========================================================
 * DELETE /api/events/[id]
 * =========================================================
 *
 * Hard deletes a draft event.
 *
 * Responsibilities:
 *
 * - requires authenticated user (must be the organizer)
 * - verifies organizer ownership
 * - blocks deletion if event is already published
 * - hard deletes the event and cascades to related tables
 * - returns deleted confirmation
 *
 * Note: to cancel a published event, use /api/events/cancel (coming soon)
 *
 * This route is safe to expose to:
 *
 * - frontend event management dashboard
 * - MCP tools (deleteEvent)
 *
 * =========================================================
 **/
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { user, error: authError } = await requireUser();
    if (!user) return NextResponse.json({ success: false, error: authError }, { status: 401 });

    const { data, error } = await deleteEvent(params.id, user.id);

    if (error) return NextResponse.json({ success: false, error }, { status: 400 });
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('EVENT_DELETE_ERROR:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
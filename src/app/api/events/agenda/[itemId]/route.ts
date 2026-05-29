/* eslint-disable @typescript-eslint/no-explicit-any */

 
import { NextResponse } from 'next/server';
import { updateAgendaItem, deleteAgendaItem } from '@/lib/events/service';
import { requireUser } from '@/lib/auth/get-user';

/**
 * =========================================================
 * PATCH /api/events/agenda/[itemId]
 * =========================================================
 *
 * Updates an existing agenda item.
 *
 * Responsibilities:
 *
 * - requires authenticated user (must be the organizer)
 * - verifies organizer ownership via event join
 * - validates partial update payload
 * - returns updated agenda item
 *
 * This route is safe to expose to:
 *
 * - frontend agenda builder
 * - MCP tools (updateAgendaItem)
 *
 * =========================================================
 */

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const { itemId }=await params;
    const { user, error: authError } = await requireUser(request);
    if (!user) return NextResponse.json({ success: false, error: authError }, { status: 401 });

    const body = await request.json();
    const { data, error } = await updateAgendaItem(itemId, body, user.id);

    if (error) return NextResponse.json({ success: false, error }, { status: 400 });
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('EVENT_AGENDA_UPDATE_ERROR:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

/** 
* =========================================================
 * DELETE /api/events/agenda/[itemId]
 * =========================================================
 *
 * Deletes an agenda item.
 *
 * Responsibilities:
 *
 * - requires authenticated user (must be the organizer)
 * - verifies organizer ownership via event join
 * - hard deletes the agenda slot
 * - returns deleted confirmation
 *
 * This route is safe to expose to:
 *
 * - frontend agenda builder
 * - MCP tools (deleteAgendaItem)
 *
 * =========================================================
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const {itemId}=await params
    const { user, error: authError } = await requireUser(request);
    if (!user) return NextResponse.json({ success: false, error: authError }, { status: 401 });

    const { data, error } = await deleteAgendaItem(itemId, user.id);

    if (error) return NextResponse.json({ success: false, error }, { status: 400 });
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('EVENT_AGENDA_DELETE_ERROR:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
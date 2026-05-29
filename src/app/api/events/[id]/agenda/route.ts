/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from 'next/server';
import { getEventAgenda, addAgendaItem } from '@/lib/events/service';
import { requireUser } from '@/lib/auth/get-user';


/**
 * =========================================================
 * GET /api/events/[id]/agenda
 * =========================================================
 *
 * Returns the full agenda for a specific event.
 *
 * Responsibilities:
 *
 * - public endpoint (agenda visible aux participants)
 * - returns agenda items ordered by start_time asc
 *
 * This route is safe to expose to:
 *
 * - public event pages
 * - MCP tools (getEventAgenda)
 * - mobile applications
 *
 * =========================================================
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const {id} = await params
    const { data, error } = await getEventAgenda(id);
    if (error) return NextResponse.json({ success: false, error }, { status: 400 });
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('EVENT_AGENDA_GET_ERROR:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}


 /** 
 * =========================================================
 * POST /api/events/[id]/agenda
 * =========================================================
 *
 * Adds a new agenda item to an event.
 *
 * Responsibilities:
 *
 * - requires authenticated user (must be the organizer)
 * - verifies organizer ownership
 * - validates agenda item payload
 * - inserts new agenda slot
 * - returns created item
 *
 * This route is safe to expose to:
 *
 * - frontend agenda builder
 * - MCP tools (addAgendaItem)
 * - automation flows
 *
 * =========================================================
 */

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string } >}
) {
  try {
    const {id}=await params;
    const { user, error: authError } = await requireUser(request);
    if (!user) return NextResponse.json({ success: false, error: authError }, { status: 401 });

    const body = await request.json();
    const { data, error } = await addAgendaItem(id, body, user.id);

    if (error) return NextResponse.json({ success: false, error }, { status: 400 });
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('EVENT_AGENDA_ADD_ERROR:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from 'next/server';
import { updateForm, deleteForm, getFormById } from '@/lib/forms/service';
import { requireUser } from '@/lib/auth/get-user';

/**
 * =========================================================
 * PATCH /api/forms/[id]
 * =========================================================
 * Updates an existing form.
 * - requires auth (must be owner)
 * - partial update
 * - MCP tools (updateForm)
 * =========================================================
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { user, error: authError } = await requireUser(request);
    if (!user) return NextResponse.json({ success: false, error: authError }, { status: 401 });

    const body = await request.json();
    const { data, error } = await updateForm(id, body, user.id);
    if (error) return NextResponse.json({ success: false, error }, { status: 400 });
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('FORM_UPDATE_ERROR:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * =========================================================
 * DELETE /api/forms/[id]
 * =========================================================
 * Hard deletes a form.
 * - requires auth (must be owner)
 * - cascades to responses and invitations
 * - MCP tools (deleteForm)
 * =========================================================
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { user, error: authError } = await requireUser(request);
    if (!user) return NextResponse.json({ success: false, error: authError }, { status: 401 });

    const { data, error } = await deleteForm(id, user.id);
    if (error) return NextResponse.json({ success: false, error }, { status: 400 });
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('FORM_DELETE_ERROR:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}


/**
 * =========================================================
 * GET /api/forms/[id]
 * =========================================================
 *
 * Retrieves a form by its ID.
 *
 * Responsibilities:
 *
 * - public forms accessible without authentication
 * - private forms require authenticated owner
 * - returns full form data including fields_json
 *
 * This route is safe to expose to:
 *
 * - public form pages
 * - frontend form builder
 * - MCP tools (getFormById)
 * - mobile applications
 *
 * =========================================================
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { user } = await requireUser(request);

    const { data, error } = await getFormById(id, user?.id);
    if (error) return NextResponse.json({ success: false, error }, { status: error === 'Unauthorized' ? 401 : 404 });
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('FORM_GET_ERROR:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
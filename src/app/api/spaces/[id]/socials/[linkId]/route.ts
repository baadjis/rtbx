/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * =========================================================
 * PATCH /api/spaces/[id]/socials/[linkId]
 * =========================================================
 * Updates a social link.
 * - requires auth (must be owner)
 * - MCP tools (updateSpaceSocialLink)
 * =========================================================
 * DELETE /api/spaces/[id]/socials/[linkId]
 * =========================================================
 * Deletes a social link.
 * - requires auth (must be owner)
 * - MCP tools (deleteSpaceSocialLink)
 * =========================================================
 */
import { NextResponse } from 'next/server';
import {
  updateSpaceSocialLink,
  deleteSpaceSocialLink,
} from '@/lib/spaces/service';
import { requireUser } from '@/lib/auth/get-user';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; linkId: string }> }
) {
  try {
    const { id, linkId } = await params;
    const { user, error: authError } = await requireUser(request);
    if (!user) return NextResponse.json({ success: false, error: authError }, { status: 401 });

    const body = await request.json();
    const { data, error } = await updateSpaceSocialLink(id, { ...body, id: linkId }, user.id);
    if (error) return NextResponse.json({ success: false, error }, { status: 400 });
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('SPACE_SOCIAL_UPDATE_ERROR:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; linkId: string }> }
) {
  try {
    const { id, linkId } = await params;
    const { user, error: authError } = await requireUser(request);
    if (!user) return NextResponse.json({ success: false, error: authError }, { status: 401 });

    const { data, error } = await deleteSpaceSocialLink(id, linkId, user.id);
    if (error) return NextResponse.json({ success: false, error }, { status: 400 });
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('SPACE_SOCIAL_DELETE_ERROR:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
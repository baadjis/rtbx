/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * =========================================================
 * GET /api/spaces/[id]/socials
 * =========================================================
 * Returns social links for a space.
 * - public endpoint
 * - MCP tools (getSpaceSocialLinks)
 * =========================================================
 * POST /api/spaces/[id]/socials
 * =========================================================
 * Adds a social link to a space.
 * - requires auth (must be owner)
 * - checks for duplicate network
 * - MCP tools (addSpaceSocialLink)
 * =========================================================
 */
import { NextResponse } from 'next/server';
import {
  getSpaceSocialLinks,
  addSpaceSocialLink,
} from '@/lib/spaces/service';
import { requireUser } from '@/lib/auth/get-user';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data, error } = await getSpaceSocialLinks(id);
    if (error) return NextResponse.json({ success: false, error }, { status: 404 });
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('SPACE_SOCIALS_GET_ERROR:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { user, error: authError } = await requireUser(request);
    if (!user) return NextResponse.json({ success: false, error: authError }, { status: 401 });

    const body = await request.json();
    const { data, error } = await addSpaceSocialLink(id, body, user.id);
    if (error) return NextResponse.json({ success: false, error }, { status: 400 });
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('SPACE_SOCIAL_ADD_ERROR:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
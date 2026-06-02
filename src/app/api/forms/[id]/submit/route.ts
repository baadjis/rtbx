/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from 'next/server';
import { submitFormResponse } from '@/lib/forms/service';
import { requireUser } from '@/lib/auth/get-user';
/**
 * =========================================================
 * POST /api/forms/[id]/submit
 * =========================================================
 * Submits a response to a published form.
 * - public endpoint (no auth required)
 * - validates form is published and active
 * - records answers, origin and metadata
 * - MCP tools (submitForm)
 * =========================================================
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // User optionnel — pas de 401 si non connecté
    const { user } = await requireUser(request);

    const { data, error } = await submitFormResponse(id, body, user?.id);
    if (error) return NextResponse.json({ success: false, error }, { status: 400 });
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('FORM_SUBMIT_ERROR:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
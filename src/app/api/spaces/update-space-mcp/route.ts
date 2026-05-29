/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * =========================================================
 * POST /api/spaces/update-mcp
 * =========================================================
 *
 * Updates an existing Space via JSON payload (MCP/API use).
 * Does not support avatar upload — text fields only.
 *
 * Responsibilities:
 *
 * - no auth required (edit_token acts as ownership key)
 * - validates edit_token
 * - updates text fields only (no file upload)
 * - returns updated space
 *
 * This route is safe to expose to:
 *
 * - MCP tools (updateSpace)
 * - automation flows
 * - mobile applications
 *
 * =========================================================
 */
import { NextResponse } from 'next/server';
import { updateSpace } from '@/lib/spaces/service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, ...payload } = body;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Missing edit token' },
        { status: 400 }
      );
    }

    const updatedSpace = await updateSpace(token, payload);

    return NextResponse.json({ success: true, space: updatedSpace });

  } catch (err: any) {
    console.error('SPACE_UPDATE_MCP_ERROR:', err);

    if (err?.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: err.errors?.[0]?.message || 'Invalid payload' },
        { status: 400 }
      );
    }

    if (err?.message === 'Space not found') {
      return NextResponse.json(
        { success: false, error: 'Space not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: false, error: err?.message || 'Unknown server error' },
      { status: 500 }
    );
  }
}
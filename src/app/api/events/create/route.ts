/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/events/create/route.ts
import { NextResponse } from 'next/server';
import { createEvent } from '@/lib/events/service';
import { requireUser } from '@/lib/auth/get-user';

/**
 * =========================================================
 * POST /api/events/create
 * =========================================================
 *
 * Creates a new event for the authenticated user.
 *
 * Security model:
 * - Requires authenticated user (organizer)
 * - Automatically assigns organizer_id
 *
 * Used by:
 * - Frontend event creation form
 * - MCP Agent (createEvent tool)
 * - Mobile applications
 * =========================================================
 */
export async function POST(request: Request) {
  try {
    const {
      user,
      error: authError
    } = await requireUser();

    if (!user) {
      return NextResponse.json({
        success: false,
        error: authError
      }, { status: 401 });
    }

    const body = await request.json();

    const { data, error } = await createEvent({
      ...body,
      organizer_id: user.id
    });

    if (error) {
      return NextResponse.json({
        success: false,
        error
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data
    });

  } catch (err: any) {
    console.error('EVENT_CREATE_ERROR:', err);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
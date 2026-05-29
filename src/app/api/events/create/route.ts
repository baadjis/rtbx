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
 * Creates a new event for the authenticated organizer.
 *
 * Responsibilities:
 *
 * - requires authenticated user (organizer)
 * - validates event payload
 * - assigns organizer_id automatically
 * - inserts event as draft (is_published: false)
 * - returns the new event id
 *
 * This route is safe to expose to:
 *
 * - frontend event creation form
 * - MCP tools (createEvent)
 * - automation flows
 *
 * =========================================================
 */
export async function POST(request: Request) {
  try {
    const {
      user,
      error: authError
    } = await requireUser(request);

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
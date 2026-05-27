/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { registerEvent } from '@/lib/events/service';

/**
 * =========================================================
 * POST /api/events/register
 * =========================================================
 *
 * Registers a participant to a public or invited event.
 *
 * Responsibilities:
 *
 * - does NOT require authentication (public endpoint)
 * - validates registration payload
 * - inserts into event_registrations
 * - upserts participant into global_discovery_pool
 * - generates a unique ticket code
 * - creates badge entry in event_badges
 * - sends confirmation email via Resend
 * - sends badge PDF immediately if badge_automation_type = 'immediate'
 * - returns ticket code
 *
 * This route is safe to expose to:
 *
 * - public event registration pages
 * - invite-only landing pages (token-gated)
 * - MCP tools (registerEvent)
 * - mobile applications
 *
 * =========================================================
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { data, error } = await registerEvent(body);

    if (error) return NextResponse.json({ success: false, error }, { status: 400 });
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('EVENT_REGISTER_ERROR:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * =========================================================
 * GET /api/keys
 * =========================================================
 * Returns all API keys for the authenticated user.
 * =========================================================
 * POST /api/keys
 * =========================================================
 * Creates a new API key for the authenticated user.
 * =========================================================
 */
import { NextResponse } from 'next/server';
import { createApiKey, getUserApiKeys } from '@/lib/api-keys/service';
import { requireUser } from '@/lib/auth/get-user';

export async function GET(request: Request) {
  try {
    const { user, error: authError } = await requireUser(request);
    if (!user) return NextResponse.json({ success: false, error: authError }, { status: 401 });

    const { data, error } = await getUserApiKeys(user.id);
    if (error) return NextResponse.json({ success: false, error }, { status: 400 });
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { user, error: authError } = await requireUser(request);
    if (!user) return NextResponse.json({ success: false, error: authError }, { status: 401 });

    const body = await request.json();

    if (!body.name) {
      return NextResponse.json({ success: false, error: 'name is required' }, { status: 400 });
    }

    const { data, error } = await createApiKey({
      user_id: user.id,
      name: body.name,
      agent_type: body.agent_type || 'all',
      mode: body.mode || 'text',
      daily_limit: body.daily_limit || 100,
    });

    if (error) return NextResponse.json({ success: false, error }, { status: 400 });
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
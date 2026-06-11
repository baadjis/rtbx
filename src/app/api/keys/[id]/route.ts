/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * =========================================================
 * DELETE /api/keys/[id]
 * =========================================================
 * Revokes an API key (sets is_active = false).
 * =========================================================
 */
import { NextResponse } from 'next/server';
import { revokeApiKey } from '@/lib/api-keys/service';
import { requireUser } from '@/lib/auth/get-user';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { user, error: authError } = await requireUser(request);
    if (!user) return NextResponse.json({ success: false, error: authError }, { status: 401 });

    const { error } = await revokeApiKey(id, user.id);
    if (error) return NextResponse.json({ success: false, error }, { status: 400 });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
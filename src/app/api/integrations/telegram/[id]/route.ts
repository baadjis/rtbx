/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
//import { requireUser } from '@/lib/auth/get-user';
import { createClient as createAdminClient } from  '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';

// api/integrations/telegram/[id]/route.ts
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    const supabaseAdmin = createAdminClient()

    const { error } = await supabaseAdmin
      .from('telegram_configs')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) return NextResponse.json({ success: false, error }, { status: 400 });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
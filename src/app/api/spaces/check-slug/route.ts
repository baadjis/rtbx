import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug')?.toLowerCase().trim();

  if (!slug || slug.length < 3) return NextResponse.json({ available: false });

  const supabase = await createClient();
  const { data } = await supabase
    .from('spaces')
    .select('id')
    .eq('slug', slug)
    .maybeSingle();

  return NextResponse.json({ available: !data });
}
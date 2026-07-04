import { NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/server';

// app/api/forms/[id]/start/route.ts
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('form_responses')
    .insert({
      form_id: id,
      answers_json: {},
      origin: 'direct',
      metadata: body.metadata,
      started_at: new Date().toISOString(),
      submitted_at: null, // pas encore soumis
    })
    .select('id')
    .single();

  if (error) return NextResponse.json({ error }, { status: 400 });
  return NextResponse.json({ id: data.id });
}
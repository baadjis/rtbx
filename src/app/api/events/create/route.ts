/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Insertion avec récupération de l'ID généré (.select().single())
    const { data, error } = await supabase
      .from('events')
      .insert([{
        organizer_id: user.id,
        title: body.title,
        description: body.description,
        category: body.category,
        visibility: body.visibility,
        requires_registration: body.requires_registration,
        location: body.location,
        start_date: body.start_date,
        end_date: body.end_date || null,
        max_capacity: body.max_capacity ? parseInt(body.max_capacity) : null,
        is_published: true // On peut aussi le mettre à false par défaut si on veut valider l'agenda avant
      }])
      .select('id')
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, id: data.id });

  } catch (err: any) {
    console.error("Event Creation Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
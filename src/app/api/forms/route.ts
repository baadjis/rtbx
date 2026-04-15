/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// GET : Lister les formulaires de l'utilisateur
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase
      .from('forms')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST : Créer un nouveau formulaire (appelé par le FormBuilder)
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { title, description, category, fields_json, settings } = body;

    const { data, error } = await supabase
      .from('forms')
      .insert([{
        user_id: user.id,
        title: title || "Formulaire sans titre",
        description,
        category,
        fields_json, // Le JSON généré par ton FormBuilder
        settings
      }])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, id: data.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
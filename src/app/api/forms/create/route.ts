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
    const { title, description, category, visibility, org_name } = body;

    // Insertion avec récupération de l'ID pour la redirection
    const { data, error } = await supabase
      .from('forms')
      .insert([{
        user_id: user.id,
        title: title || "Sans titre",
        description: description || "",
        category: category || "survey",
        visibility: visibility || "public",
        org_name: org_name || "RetailBox User",
        fields_json: [], // Initialisé vide pour le DesignTab
        is_published: false,
        settings: { active: true, theme: "indigo" }
      }])
      .select('id')
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, id: data.id });

  } catch (err: any) {
    console.error("Form Creation Error:", err.message);
    
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
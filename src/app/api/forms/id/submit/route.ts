/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { answers, metadata } = body;

    // Note : On utilise le client serveur standard
    const supabase = await createClient();

    // 1. On vérifie si le formulaire accepte encore des réponses
    const { data: form } = await supabase
      .from('forms')
      .select('settings')
      .eq('id', id)
      .single();

    if (!form || form.settings.active === false) {
      return NextResponse.json({ error: "Ce formulaire n'accepte plus de réponses." }, { status: 403 });
    }

    // 2. Enregistrement de la réponse
    const { error } = await supabase
      .from('form_responses')
      .insert([{
        form_id: id,
        answers_json: answers,
        metadata: metadata || {}
      }]);

    if (error) throw error;

    return NextResponse.json({ success: true, message: "Merci pour votre réponse !" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
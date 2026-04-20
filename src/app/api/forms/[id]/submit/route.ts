/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // On extrait les réponses, les métadonnées et l'origine (tracking)
    const { answers, metadata, origin } = body;

    const supabase = await createClient();

    // 1. Vérifier si le formulaire existe et est actif
    const { data: form, error: formErr } = await supabase
      .from('forms')
      .select('settings, is_published')
      .eq('id', id)
      .single();

    if (formErr || !form) {
        return NextResponse.json({ error: "Formulaire introuvable" }, { status: 404 });
    }

    if (!form.is_published || form.settings?.active === false) {
      return NextResponse.json({ 
        error: "Ce formulaire n'est plus en ligne ou n'accepte plus de réponses." 
      }, { status: 403 });
    }

    // 2. Enregistrement de la réponse avec l'origine
    const { error: insertErr } = await supabase
      .from('form_responses')
      .insert([{
        form_id: id,
        answers_json: answers,
        origin: origin || 'direct', // flyer, email_invite, etc.
        metadata: metadata || {}
      }]);

    if (insertErr) throw insertErr;

    return NextResponse.json({ 
        success: true, 
        message: "Réponse enregistrée avec succès." 
    });

  } catch (err: any) {
    console.error("Submission Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
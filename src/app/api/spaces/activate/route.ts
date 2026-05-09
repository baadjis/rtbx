/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { getSpaceWelcomeEmail } from '@/utils/email-templates';

const resend = new Resend(process.env.RESEND_API_KEY);

// Utilisation de la clé SERVICE_ROLE pour bypasser le RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! 
);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Insertion dans la table spaces via le client Admin
    const { data, error } = await supabaseAdmin.from('spaces').insert([{
        user_id: body.user_id || null,
        email: body.email,
        slug: body.slug,
        space_type: body.space_type,
        space_subtype:body.space_subtype,
        entity_name: body.entity_name,
        social_data: body.social_data,
        theme_color: body.theme_color,
        bg_color: body.bg_color,
        logo_url: body.logo_url,
        legal_accepted_at: body.legal_accepted_at,
        is_authorized_representative: body.is_authorized_representative
    }]).select().single();

    if (error) throw error;

    // 2. Préparation du nom affiché pour l'e-mail
    const displayName = body.space_type === 'organization' ? body.entity_name : body.email;
    
    // 3. Génération du contenu de l'e-mail avec le lien d'édition secret (edit_token)
    const htmlContent = getSpaceWelcomeEmail({
      displayName: displayName,
      slug: data.slug || data.id,
      spaceId:data.id,
      editUrl: `https://www.rtbx.space/edit/space?token=${data.edit_token}`,
    }, body.lang);

    // 4. Envoi via Resend
    await resend.emails.send({
      from: 'RetailBox Space <hello@rtbx.space>',
      to: body.email,
      subject: body.lang === 'fr' ? 'Votre Espace RetailBox est prêt !' : 'Your RetailBox Space is ready!',
      html: htmlContent
    });

    return NextResponse.json({ success: true, id: data.slug || data.id });

  } catch (err: any) {
    console.error("API Activation Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/utils/supabase/server';
import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { getSpaceWelcomeEmail } from '@/utils/email-templates';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = await createClient();

    // 1. Insertion exacte avec TES champs
    const { data, error } = await supabase.from('spaces').insert([{
        user_id: body.user_id,
        email: body.email,
        account_type: body.account_type,
        organization_name: body.organization_name,
        social_data: body.social_data,
        theme_color: body.theme_color,
        bg_color: body.bg_color,
        logo_url: body.logo_url,
        legal_accepted_at: body.legal_accepted_at,
        is_authorized_representative: body.is_authorized_representative
    }]).select().single();

    if (error) throw error;

    // 2. Envoi de l'e-mail après succès
    const displayName = body.account_type === 'organization' ? body.organization_name : body.email;
    const spaceUrl = `https://www.rtbx.space/@/${data.id}`;
    
    const htmlContent = getSpaceWelcomeEmail({
      displayName: displayName,
      spaceId: data.id,
      spaceUrl: spaceUrl
    }, body.lang);

    await resend.emails.send({
      from: 'RetailBox <hello@rtbx.space>',
      to: body.email,
      subject: body.lang === 'fr' ? 'Votre Espace RetailBox est prêt !' : 'Your RetailBox Space is ready!',
      html: htmlContent
    });

    return NextResponse.json({ success: true, id: data.id });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
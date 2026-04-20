/* eslint-disable @typescript-eslint/no-explicit-any */
import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { emails, formId, lang } = await request.json();
    const supabase = await createClient();

    const { data: form } = await supabase.from('forms').select('*').eq('id', formId).single();
    if (!form) return NextResponse.json({ error: "Form not found" }, { status: 404 });

    const formLink = `https://www.rtbx.space/f/${form.id}`;

    // Envoi groupé via Resend
    const { data, error } = await resend.emails.send({
      from: 'RetailBox <forms@rtbx.space>',
      to: emails, // Resend accepte un tableau d'emails
      subject: lang === 'fr' ? `Votre avis nous intéresse : ${form.title}` : `We value your feedback: ${form.title}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px;">
          <h2 style="color: #4f46e5;">${form.title}</h2>
          <p>${lang === 'fr' ? 'Bonjour, nous aimerions connaître votre avis.' : 'Hello, we would love to hear your thoughts.'}</p>
          <div style="margin: 30px 0; text-align: center;">
            <a href="${formLink}" style="background: #4f46e5; color: white; padding: 15px 25px; border-radius: 12px; text-decoration: none; font-weight: bold;">
                ${lang === 'fr' ? 'Répondre au sondage' : 'Take the survey'}
            </a>
          </div>
          <p style="font-size: 12px; color: #94a3b8;">RetailBox Intelligence - GDPR Compliant</p>
        </div>
      `
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
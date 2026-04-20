/* eslint-disable @typescript-eslint/no-explicit-any */
import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getFormInvitationEmail } from '@/utils/email-templates';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { emails, formId, lang } = await request.json();
    const supabase = await createClient();

    const { data: form } = await supabase.from('forms').select('*').eq('id', formId).single();
    if (!form) return NextResponse.json({ error: "Form not found" }, { status: 404 });



    // À l'intérieur de la boucle ou avant l'envoi
const formLinkWithOrigin = `https://www.rtbx.space/f/${form.id}?origin=email_invite`;
const orgName = form.org_name || "RetailBox Partner";

const htmlContent = getFormInvitationEmail({
    orgName: orgName,
    formTitle: form.title,
    formLink: formLinkWithOrigin
}, lang);

    // Envoi groupé via Resend
    const { data, error } = await resend.emails.send({
      from: `${orgName} via RetailBox Forms <forms@rtbx.space>`,
      to: emails, // Resend accepte un tableau d'emails
      subject: lang === 'fr' ? `Votre avis nous intéresse : ${form.title}` : `We value your feedback: ${form.title}`,
      html: htmlContent
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/utils/supabase/server';
import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { getFormInvitationEmail } from '@/utils/email-templates';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { formId, lang } = await request.json();
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 1. Publier le formulaire
    const { data: form, error: formErr } = await supabase
      .from('forms')
      .update({ is_published: true })
      .eq('id', formId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (formErr) throw formErr;

    // 2. Envoyer les invitations en attente
    const { data: pending } = await supabase.from('form_invitations').select('*').eq('form_id', formId).eq('status', 'pending');

    if (pending && pending.length > 0) {
      for (const invite of pending) {
        const link = `https://www.rtbx.space/f/${form.id}?token=${invite.token}&origin=mail_invite`;
        const html = getFormInvitationEmail({ orgName: form.org_name, formTitle: form.title, formLink: link }, lang);

        await resend.emails.send({
          from: 'RetailBox <forms@rtbx.space>',
          to: invite.email,
          subject: lang === 'fr' ? `Votre avis : ${form.title}` : `Your feedback: ${form.title}`,
          html: html
        });
        await supabase.from('form_invitations').update({ status: 'sent' }).eq('id', invite.id);
      }
    }

    return NextResponse.json({ success: true, count: pending?.length || 0 });
  } catch (err: any) {
    console.log(err)
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
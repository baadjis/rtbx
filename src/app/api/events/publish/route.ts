/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/utils/supabase/server';
import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { getInvitationEmail } from '@/utils/email-templates';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { eventId, lang } = await request.json();
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 1. Publier l'événement
    const { data: event, error: eventErr } = await supabase
      .from('events')
      .update({ is_published: true })
      .eq('id', eventId)
      .eq('organizer_id', user.id)
      .select('*, profiles(company)')
      .single();

    if (eventErr) throw eventErr;

    // 2. Récupérer les invitations en attente
    const { data: pendingInvites } = await supabase
      .from('event_invitations')
      .select('*')
      .eq('event_id', eventId)
      .eq('status', 'pending');

    let sentCount = 0;

    // 3. Boucle d'envoi si des invitations existent
    if (pendingInvites && pendingInvites.length > 0) {
      const orgName = event?.org_name || "RetailBox Partner";

      for (const invite of pendingInvites) {
        try {
          const inviteLink = `https://www.rtbx.space/events/${event.id}?token=${invite.token}&origin=mail_invite`;
          const htmlContent = getInvitationEmail({
              orgName: orgName,
              eventTitle: event.title,
              inviteLink: inviteLink
          }, lang);

          await resend.emails.send({
            from: 'RetailBox Events <events@rtbx.space>',
            to: invite.email,
            subject: lang === 'fr' ? `Invitation : ${event.title}` : `Invitation: ${event.title}`,
            html: htmlContent
          });

          // Marquer comme envoyé pour ne pas renvoyer si on republie plus tard
          await supabase.from('event_invitations').update({ status: 'sent' }).eq('id', invite.id);
          sentCount++;
        } catch (e) {
          console.error(`Erreur envoi à ${invite.email}`, e);
        }
      }
    }

    return NextResponse.json({ success: true, invitationsSent: sentCount });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
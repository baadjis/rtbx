// lib/events/services.ts
import { createClient } from '@/utils/supabase/client';
import { eventCreateSchema, eventPublishSchema } from './validators';
import type { EventCreateInput, EventPublishInput } from './validators';
import { Resend } from 'resend';
import { getInvitationEmail } from '@/utils/email-templates';

const resend = new Resend(process.env.RESEND_API_KEY);

/* =========================================================
   CREATE EVENT
========================================================= */
export async function createEvent(payload: EventCreateInput & { organizer_id: string }) {
  const supabase = createClient();

  const parsed = eventCreateSchema.safeParse(payload);
  if (!parsed.success) {
    return { data: null, error: parsed.error.flatten() };
  }

  const { data, error } = await supabase
    .from('events')
    .insert([{
      organizer_id: payload.organizer_id,
      title: parsed.data.title,
      description: parsed.data.description,
      category: parsed.data.category,
      visibility: parsed.data.visibility,
      requires_registration: parsed.data.requires_registration,
      location: parsed.data.location,
      start_date: parsed.data.start_date,
      end_date: parsed.data.end_date,
      max_capacity: parsed.data.max_capacity,
      org_name: parsed.data.org_name,
      is_published: false,
    }])
    .select('id')
    .single();

  return { data, error };
}

/* =========================================================
   PUBLISH EVENT + SEND INVITES
========================================================= */
export async function publishEvent(payload: EventPublishInput & { organizer_id: string }) {
  const supabase = createClient();

  const parsed = eventPublishSchema.safeParse(payload);
  if (!parsed.success) {
    return { data: null, error: parsed.error.flatten() };
  }

  // 1. Publier l'événement
  const { data: event, error: eventErr } = await supabase
    .from('events')
    .update({ is_published: true })
    .eq('id', parsed.data.eventId)
    .eq('organizer_id', payload.organizer_id)
    .select('*, profiles(company)')
    .single();

  if (eventErr) return { data: null, error: eventErr };

  // 2. Récupérer les invitations en attente
  const { data: pendingInvites } = await supabase
    .from('event_invitations')
    .select('*')
    .eq('event_id', parsed.data.eventId)
    .eq('status', 'pending');

  let sentCount = 0;

  if (pendingInvites && pendingInvites.length > 0) {
    const orgName = event?.org_name || "RetailBox Partner";

    for (const invite of pendingInvites) {
      try {
        const inviteLink = `https://www.rtbx.space/events/${event.id}?token=${invite.token}&origin=mail_invite`;

        const htmlContent = getInvitationEmail({
          orgName,
          eventTitle: event.title,
          inviteLink
        }, parsed.data.lang);

        await resend.emails.send({
          from: 'RetailBox Events <events@rtbx.space>',
          to: invite.email,
          subject: parsed.data.lang === 'fr' ? `Invitation : ${event.title}` : `Invitation: ${event.title}`,
          html: htmlContent
        });

        await supabase
          .from('event_invitations')
          .update({ status: 'sent' })
          .eq('id', invite.id);

        sentCount++;
      } catch (e) {
        console.error(`Erreur envoi à ${invite.email}`, e);
      }
    }
  }

  return { 
    data: { event, invitationsSent: sentCount }, 
    error: null 
  };
}

export default {
  createEvent,
  publishEvent,
};
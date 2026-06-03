/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/events/services.ts
import { createClient } from '@/utils/supabase/client';
import { agendaItemSchema, agendaUpdateSchema, eventCancelSchema, eventCreateSchema, eventOrganizerSearchSchema, eventPublicSearchSchema, eventPublishSchema, eventUpdateSchema, sendInviteSchema } from './validators';
import type { AgendaItemInput, AgendaUpdateInput, EventCancelInput, EventCreateInput, EventOrganizerSearchInput, EventPublicSearchInput, EventPublishInput, EventUpdateInput, SendInviteInput } from './validators';
import { Resend } from 'resend';
import { getEventCancellationEmail, getInvitationEmail } from '@/utils/email-templates';
import { registerEventSchema, sendBadgesSchema } from './validators';
import type { RegisterEventInput, SendBadgesInput } from './validators';
import { getConfirmationEmail, getBadgeDeliveryEmail } from '@/utils/email-templates';


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



/* =========================================================
   REGISTER EVENT
========================================================= */
export async function registerEvent(payload: RegisterEventInput) {
  const supabase = await createClient();
  const parsed = registerEventSchema.safeParse(payload);
  if (!parsed.success) return { data: null, error: parsed.error.flatten() };

  const { eventId, name, email, lang, origin, company_name, professional_role,
    custom_data, opt_in_discovery, opt_in_merchant } = parsed.data;

  // 1. Récupérer l'event
  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('id', eventId)
    .single();

  if (!event) return { data: null, error: 'Event not found' };

  // 2. Inscription
  const { data: regData, error: regError } = await supabase
    .from('event_registrations')
    .insert([{
      event_id: eventId,
      full_name: name,
      email,
      company_name: company_name || null,
      professional_role: professional_role || null,
      custom_data: custom_data || {},
      source_campaign: origin || 'direct',
      status_at_registration: 'guest',
      opt_in_merchant: opt_in_merchant || false,
    }])
    .select()
    .single();

  if (regError) return { data: null, error: regError };

  // 3. Global discovery pool
  await supabase.from('global_discovery_pool').upsert({
    email,
    first_name: name.split(' ')[0],
    last_name: name.split(' ').slice(1).join(' '),
    origin_type: 'event',
    origin_id: eventId.toString(),
    origin_name: origin || 'direct_link',
    opt_in_discovery: opt_in_discovery || false,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'email' });

  // 4. Badge
  const ticketCode = `TKT-${crypto.randomUUID().split('-')[0].toUpperCase()}`;
  const { data: badgeData, error: badgeError } = await supabase
    .from('event_badges')
    .insert([{
      registration_id: regData.id,
      event_id: eventId,
      ticket_code: ticketCode,
      access_level: 'participant',
    }])
    .select()
    .single();

  if (badgeError) return { data: null, error: badgeError };

  // 5. Email confirmation
  const dateFormatted = new Date(event.start_date).toLocaleDateString(
    lang === 'fr' ? 'fr-FR' : 'en-US',
    { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }
  );

  const confirmationHtml = getConfirmationEmail({
    userName: name,
    eventTitle: event.title,
    date: dateFormatted,
    location: event.location,
  }, lang);

  await resend.emails.send({
    from: 'RetailBox <contact@rtbx.space>',
    to: email,
    subject: lang === 'fr' ? `Confirmation : ${event.title}` : `Confirmed: ${event.title}`,
    html: confirmationHtml,
  });

  // 6. Badge immédiat si configuré
  if (event.badge_automation_type === 'immediate') {
    try {
      const pythonRes = await fetch('https://baadjis-utilitybox.hf.space/api/gen-event-badge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': process.env.NEXT_PUBLIC_RTBX_API_SECRET_KEY || '',
        },
        body: JSON.stringify({
          full_name: name,
          company: company_name || '',
          role: 'participant',
          ticket_code: ticketCode,
          event_name: event.title,
          org_logo: event.org_logo_url,
          sponsors: event.sponsors_data,
          format: event.badge_format || 'A6',
          theme_color: event.theme_color || '#4f46e5',
          badge_settings: event.badge_settings || {},
          useful_info: event.useful_info || '',
        }),
      });

      if (pythonRes.ok) {
        const { pdf_base64 } = await pythonRes.json();
        const badgeHtml = getBadgeDeliveryEmail({
          userName: name,
          eventTitle: event.title,
          ticketCode,
        }, lang);

        await resend.emails.send({
          from: 'RetailBox Events <events@rtbx.space>',
          to: email,
          subject: lang === 'fr' ? `Votre Badge : ${event.title}` : `Your Badge: ${event.title}`,
          html: badgeHtml,
          attachments: [{ filename: `badge-${ticketCode}.pdf`, content: pdf_base64 }],
        });

        await supabase.from('event_badges').update({ badge_sent: true }).eq('id', badgeData.id);
      }
    } catch (err) {
      console.error('Erreur badge immédiat (le cron prendra le relais):', err);
    }
  }

  return { data: { ticketCode }, error: null };
}

/* =========================================================
   SEND BADGES
========================================================= */
export async function sendBadges(payload: SendBadgesInput & { organizer_id: string }) {
  const supabase = await createClient();
  const parsed = sendBadgesSchema.safeParse(payload);
  if (!parsed.success) return { data: null, error: parsed.error.flatten() };

  const { eventId, lang } = parsed.data;

  // Vérifier que l'organisateur est bien le owner
  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('id', eventId)
    .eq('organizer_id', payload.organizer_id)
    .single();

  if (!event) return { data: null, error: 'Event not found or unauthorized' };

  const { data: badges } = await supabase
    .from('event_badges')
    .select('*, event_registrations(*)')
    .eq('event_id', eventId);

  if (!badges) return { data: null, error: 'No badges found' };

  const results = { sent: 0, failed: 0 };

  for (const badge of badges) {
    const participant = badge.event_registrations;
    try {
      const pythonRes = await fetch('https://baadjis-utilitybox.hf.space/api/gen-event-badge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': process.env.NEXT_PUBLIC_RTBX_API_SECRET_KEY || '',
        },
        body: JSON.stringify({
          full_name: participant.full_name,
          company: participant.company_name || '',
          role: badge.access_level || 'participant',
          ticket_code: badge.ticket_code,
          event_name: event.title,
          org_logo: event.org_logo_url,
          sponsors: event.sponsors_data,
          format: event.badge_format || 'A6',
          theme_color: event.theme_color,
          badge_settings: event.badge_settings,
          useful_info: event.useful_info,
        }),
      });

      if (!pythonRes.ok) throw new Error('Python PDF generation failed');

      const { pdf_base64 } = await pythonRes.json();
      const htmlContent = getBadgeDeliveryEmail({
        userName: participant.full_name,
        eventTitle: event.title,
        ticketCode: badge.ticket_code,
      }, lang);

      await resend.emails.send({
        from: 'RetailBox Events <events@rtbx.space>',
        to: participant.email,
        subject: lang === 'fr' ? `Votre Badge : ${event.title}` : `Your Badge: ${event.title}`,
        html: htmlContent,
        attachments: [{ filename: `badge-${badge.ticket_code}.pdf`, content: pdf_base64 }],
      });

      await supabase.from('event_badges').update({ badge_sent: true }).eq('id', badge.id);
      results.sent++;
    } catch (err) {
      console.error(`Erreur d'envoi pour ${participant?.email}:`, err);
      results.failed++;
    }
  }

  return { data: results, error: null };
}


/* =========================================================
   SEND INVITE
========================================================= */
export async function sendInvite(payload: SendInviteInput & { organizer_id: string }) {
  const supabase =  createClient();
  const parsed = sendInviteSchema.safeParse(payload);
  if (!parsed.success) return { data: null, error: parsed.error.flatten() };

  const { email, eventId, lang } = parsed.data;

  // Vérifier que l'event appartient à l'organisateur
  const { data: event } = await supabase
    .from('events')
    .select('*, profiles(company)')
    .eq('id', eventId)
    .eq('organizer_id', payload.organizer_id)
    .single();

  if (!event) return { data: null, error: 'Event not found or unauthorized' };

  const token = crypto.randomUUID();

  const { error: inviteError } = await supabase
    .from('event_invitations')
    .insert([{ event_id: eventId, email, token, status: 'pending' }]);

  if (inviteError) return { data: null, error: inviteError };

  const inviteLink = `https://www.rtbx.space/events/${event.id}?token=${token}&origin=mail_invite`;
  const orgName = event.org_name || 'RetailBox Partner';

  const htmlContent = getInvitationEmail({ orgName, eventTitle: event.title, inviteLink }, lang);

  const { data, error } = await resend.emails.send({
    from: 'RetailBox Events <events@rtbx.space>',
    to: email,
    subject: lang === 'fr' ? `Invitation : ${event.title}` : `Invitation: ${event.title}`,
    html: htmlContent,
    tags: [
      { name: 'category', value: 'invitation' },
      { name: 'event_id', value: eventId.toString() },
    ],
  });

  if (error) return { data: null, error: error.message };

  return { data: { success: true, id: data?.id }, error: null };
}

/* =========================================================
   UPDATE EVENT
========================================================= */
export async function updateEvent(
  eventId: string,
  payload: EventUpdateInput,
  organizer_id: string
) {
  const supabase = createClient();
  const parsed = eventUpdateSchema.safeParse(payload);
  if (!parsed.success) return { data: null, error: parsed.error.flatten() };

  const { data, error } = await supabase
    .from('events')
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq('id', eventId)
    .eq('organizer_id', organizer_id)
    .select()
    .single();

  if (error) return { data: null, error };
  return { data, error: null };
}

/* =========================================================
   DELETE EVENT
========================================================= */
export async function deleteEvent(eventId: string, organizer_id: string) {
  const supabase =  createClient();

  // Vérifier ownership + statut non publié
  const { data: event } = await supabase
    .from('events')
    .select('id, is_published')
    .eq('id', eventId)
    .eq('organizer_id', organizer_id)
    .single();

  if (!event) return { data: null, error: 'Event not found or unauthorized' };
  if (event.is_published) return { data: null, error: 'Cannot delete a published event. Use cancel instead.' };

  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', eventId);

  if (error) return { data: null, error };
  return { data: { deleted: true }, error: null };
}

/* =========================================================
   GET EVENT REGISTRATIONS
========================================================= */
export async function getEventRegistrations(eventId: string, organizer_id: string) {
  const supabase = createClient();

  // Vérifier ownership
  const { data: event } = await supabase
    .from('events')
    .select('id')
    .eq('id', eventId)
    .eq('organizer_id', organizer_id)
    .single();

  if (!event) return { data: null, error: 'Event not found or unauthorized' };

  const { data, error } = await supabase
    .from('event_registrations')
    .select('*')
    .eq('event_id', eventId)
    .order('created_at', { ascending: false });

  if (error) return { data: null, error };
  return { data, error: null };
}

/* =========================================================
   GET EVENT INVITATIONS
========================================================= */
export async function getEventInvitations(eventId: string, organizer_id: string) {
  const supabase =  createClient();

  // Vérifier ownership
  const { data: event } = await supabase
    .from('events')
    .select('id')
    .eq('id', eventId)
    .eq('organizer_id', organizer_id)
    .single();

  if (!event) return { data: null, error: 'Event not found or unauthorized' };

  const { data, error } = await supabase
    .from('event_invitations')
    .select('*')
    .eq('event_id', eventId)
    .order('created_at', { ascending: false });

  if (error) return { data: null, error };
  return { data, error: null };
}

/* =========================================================
   GET EVENT AGENDA
========================================================= */
export async function getEventAgenda(eventId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('event_agenda')
    .select('*')
    .eq('event_id', eventId)
    .order('start_time', { ascending: true });

  if (error) return { data: null, error };
  return { data, error: null };
}

/* =========================================================
   ADD AGENDA ITEM
========================================================= */
export async function addAgendaItem(
  eventId: string,
  payload: AgendaItemInput,
  organizer_id: string
) {
  const supabase =  createClient();
  const parsed = agendaItemSchema.safeParse(payload);
  if (!parsed.success) return { data: null, error: parsed.error.flatten() };

  // Vérifier ownership
  const { data: event } = await supabase
    .from('events')
    .select('id')
    .eq('id', eventId)
    .eq('organizer_id', organizer_id)
    .single();

  if (!event) return { data: null, error: 'Event not found or unauthorized' };

  const { data, error } = await supabase
    .from('event_agenda')
    .insert([{ event_id: eventId, ...parsed.data }])
    .select()
    .single();

  if (error) return { data: null, error };
  return { data, error: null };
}

/* =========================================================
   UPDATE AGENDA ITEM
========================================================= */
export async function updateAgendaItem(
  agendaItemId: string,
  payload: AgendaUpdateInput,
  organizer_id: string
) {
  const supabase =  createClient();
  const parsed = agendaUpdateSchema.safeParse(payload);
  if (!parsed.success) return { data: null, error: parsed.error.flatten() };

  // Vérifier ownership via jointure events
  const { data: item } = await supabase
    .from('event_agenda')
    .select('id, event_id, events(organizer_id)')
    .eq('id', agendaItemId)
    .single();

  if (!item) return { data: null, error: 'Agenda item not found' };
  if ((item.events as any)?.organizer_id !== organizer_id) {
    return { data: null, error: 'Unauthorized' };
  }

  const { data, error } = await supabase
    .from('event_agenda')
    .update(parsed.data)
    .eq('id', agendaItemId)
    .select()
    .single();

  if (error) return { data: null, error };
  return { data, error: null };
}

/* =========================================================
   DELETE AGENDA ITEM
========================================================= */
export async function deleteAgendaItem(agendaItemId: string, organizer_id: string) {
  const supabase = await createClient();

  // Vérifier ownership via jointure events
  const { data: item } = await supabase
    .from('event_agenda')
    .select('id, events(organizer_id)')
    .eq('id', agendaItemId)
    .single();

  if (!item) return { data: null, error: 'Agenda item not found' };
  if ((item.events as any)?.organizer_id !== organizer_id) {
    return { data: null, error: 'Unauthorized' };
  }

  const { error } = await supabase
    .from('event_agenda')
    .delete()
    .eq('id', agendaItemId);

  if (error) return { data: null, error };
  return { data: { deleted: true }, error: null };
}

/* =========================================================
   GET MY EVENTS
========================================================= */
export async function getMyEvents(user_id: string, email: string) {
  const supabase =  await createClient();

  const [organized, registered, invited] = await Promise.all([
    // Events organisés
    supabase
      .from('events')
      .select('*')
      .eq('organizer_id', user_id)
      .order('created_at', { ascending: false }),

    // Events où l'user est inscrit (via email)
    supabase
      .from('event_registrations')
      .select('*, events(*)')
      .eq('email', email)
      .order('created_at', { ascending: false }),

    // Events où l'user est invité (via email)
    supabase
      .from('event_invitations')
      .select('*, events(*)')
      .eq('email', email)
      .order('created_at', { ascending: false }),
  ]);
  const data={
      organized: organized.data ?? [],
      registered: registered.data ?? [],
      invited: invited.data ?? [],
  }
  console.log(data)
  console.log('organized error:', organized.error);
console.log('registered error:', registered.error);
console.log('invited error:', invited.error);
  return {
    data,
    error: organized.error || registered.error || invited.error || null,
  };
}

/* =========================================================
   CANCEL EVENT
========================================================= */
export async function cancelEvent(
  payload: EventCancelInput & { organizer_id: string }
) {
  const supabase =  createClient();
  const parsed = eventCancelSchema.safeParse(payload);
  if (!parsed.success) return { data: null, error: parsed.error.flatten() };

  const { eventId, reason, lang } = parsed.data;

  // 1. Vérifier ownership + que l'event est publié
  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('id', eventId)
    .eq('organizer_id', payload.organizer_id)
    .single();

  if (!event) return { data: null, error: 'Event not found or unauthorized' };
  if (!event.is_published) return { data: null, error: 'Event is not published. Use delete instead.' };

  // 2. Update status → cancelled
  const { error: updateError } = await supabase
    .from('events')
    .update({ status: 'cancelled' })
    .eq('id', eventId);

  if (updateError) return { data: null, error: updateError };

  // 3. Fetch registered + invited en parallèle
  const [registrations, invitations] = await Promise.all([
    supabase
      .from('event_registrations')
      .select('email')
      .eq('event_id', eventId),
    supabase
      .from('event_invitations')
      .select('email')
      .eq('event_id', eventId),
  ]);

  // 4. Fusionner sans doublons
  const allEmails = Array.from(new Set([
    ...(registrations.data ?? []).map(r => r.email),
    ...(invitations.data ?? []).map(i => i.email),
  ]));

  // 5. Envoyer les mails de cancel
  const html = getEventCancellationEmail({ eventTitle: event.title, reason }, lang);
  let notified = 0;

  for (const email of allEmails) {
    try {
      await resend.emails.send({
        from: 'RetailBox Events <events@rtbx.space>',
        to: email,
        subject: lang === 'fr'
          ? `Annulation : ${event.title}`
          : `Cancelled: ${event.title}`,
        html,
      });
      notified++;
    } catch (err) {
      console.error(`Erreur envoi cancel à ${email}:`, err);
    }
  }

  return {
    data: { cancelled: true, notified },
    error: null,
  };
}


/* =========================================================
   SEARCH PUBLIC EVENTS
========================================================= */
export async function searchPublicEvents(payload: EventPublicSearchInput) {
  const supabase = createClient();
  const parsed = eventPublicSearchSchema.safeParse(payload);
  if (!parsed.success) return { data: null, error: parsed.error.flatten() };

  const { q, category, location, org_name, start_date, limit, offset } = parsed.data;

  let query = supabase
    .from('events')
    .select('*', { count: 'exact' })
    .eq('visibility', 'public')
    .eq('is_published', true);

  if (q) query = query.ilike('title', `%${q}%`);
  if (category) query = query.eq('category', category);
  if (location) query = query.ilike('location', `%${location}%`);
  if (org_name) query = query.ilike('org_name', `%${org_name}%`);
  if (start_date) query = query.gte('start_date', start_date);

  const { data, error, count } = await query
    .order('start_date', { ascending: true })
    .range(offset, offset + limit - 1);

  if (error) return { data: null, error };
  return { data, count, error: null };
}

/* =========================================================
   SEARCH ORGANIZER EVENTS
========================================================= */
export async function searchOrganizerEvents(
  payload: EventOrganizerSearchInput,
  organizer_id: string
) {
  const supabase = createClient();
  const parsed = eventOrganizerSearchSchema.safeParse(payload);
  if (!parsed.success) return { data: null, error: parsed.error.flatten() };

  const { q, category, org_name, status, start_date, end_date, limit, offset } = parsed.data;

  let query = supabase
    .from('events')
    .select('*', { count: 'exact' })
    .eq('organizer_id', organizer_id);

  if (q) query = query.ilike('title', `%${q}%`);
  if (category) query = query.eq('category', category);
  if (org_name) query = query.ilike('org_name', `%${org_name}%`);
  if (status) query = query.eq('status', status);
  if (start_date) query = query.gte('start_date', start_date);
  if (end_date) query = query.lte('end_date', end_date);

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) return { data: null, error };
  return { data, count, error: null };
}

export default {
  createEvent,
  publishEvent,
};
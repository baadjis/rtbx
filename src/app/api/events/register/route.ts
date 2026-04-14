/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/utils/supabase/server';
import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { getConfirmationEmail, getBadgeDeliveryEmail } from '@/utils/email-templates';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { 
      eventId, name, email, lang, origin, 
      company_name, professional_role, custom_data,
      opt_in_discovery, opt_in_merchant // Nouveaux champs de consentement
    } = await request.json();
    
    const supabase = await createClient();

    // 1. Récupérer les détails complets de l'événement
    const { data: event } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();

    if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });

    // 2. INSERTION 1 : Inscription avec consentement marchand
    const { data: regData, error: regError } = await supabase
      .from('event_registrations')
      .insert([{
        event_id: eventId,
        full_name: name,
        email: email,
        company_name: company_name || null,
        professional_role: professional_role || null,
        custom_data: custom_data || {},
        source_campaign: origin || 'direct',
        status_at_registration: 'guest',
        opt_in_merchant: opt_in_merchant || false // Sauvegarde du consentement pour l'organisateur
      }])
      .select().single();

    if (regError) throw regError;

    // 3. LOGIQUE CRM : Alimenter le Pool Global avec consentement Discovery
    // On met à jour ou on crée l'entrée dans le pool global
    await supabase.from('global_discovery_pool').upsert({
        email: email,
        first_name: name.split(' ')[0],
        last_name: name.split(' ').slice(1).join(' '),
        origin_type: 'event',
        origin_id: eventId.toString(),
        origin_name: origin || 'direct_link',
        opt_in_discovery: opt_in_discovery || false, // Sauvegarde du consentement pour RetailBox
        updated_at: new Date().toISOString()
    }, { onConflict: 'email' });

    // 4. INSERTION 2 : Le Badge (Donnée Technique)
    const ticketCode = `TKT-${crypto.randomUUID().split('-')[0].toUpperCase()}`;
    const { data: badgeData, error: badgeError } = await supabase
      .from('event_badges')
      .insert([{
        registration_id: regData.id,
        event_id: eventId,
        ticket_code: ticketCode,
        access_level: 'participant'
      }])
      .select().single();

    if (badgeError) throw badgeError;

    // 5. ENVOI EMAIL : Confirmation Standard
    const dateFormatted = new Date(event.start_date).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    const confirmationHtml = getConfirmationEmail({
      userName: name,
      eventTitle: event.title,
      date: dateFormatted,
      location: event.location
    }, lang);

    await resend.emails.send({
      from: 'RetailBox <contact@rtbx.space>',
      to: email,
      subject: lang === 'fr' ? `Confirmation : ${event.title}` : `Confirmed: ${event.title}`,
      html: confirmationHtml
    });

    // 6. AUTOMATISATION : Envoi immédiat du Badge PDF (si configuré)
    if (event.badge_automation_type === 'immediate') {
      try {
        const pythonRes = await fetch("https://baadjis-utilitybox.hf.space/api/gen-event-badge", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "X-API-KEY": process.env.NEXT_PUBLIC_RTBX_API_SECRET_KEY || "" 
          },
          body: JSON.stringify({
            full_name: name,
            company: company_name || "",
            role: 'participant',
            ticket_code: ticketCode,
            event_name: event.title,
            org_logo: event.org_logo_url,
            sponsors: event.sponsors_data,
            format: event.badge_format || 'A6',
            theme_color: event.theme_color || '#4f46e5',
            badge_settings: event.badge_settings || {},
            useful_info: event.useful_info || ""
          })
        });

        if (pythonRes.ok) {
          const { pdf_base64 } = await pythonRes.json();
          const badgeHtml = getBadgeDeliveryEmail({
            userName: name,
            eventTitle: event.title,
            ticketCode: ticketCode
          }, lang);

          await resend.emails.send({
            from: 'RetailBox Events <events@rtbx.space>',
            to: email,
            subject: lang === 'fr' ? `Votre Badge : ${event.title}` : `Your Badge: ${event.title}`,
            html: badgeHtml,
            attachments: [{
              filename: `badge-${ticketCode}.pdf`,
              content: pdf_base64,
            }]
          });

          await supabase.from('event_badges').update({ badge_sent: true }).eq('id', badgeData.id);
        }
      } catch (err) {
        console.error("Erreur badge immédiat (le cron prendra le relais):", err);
      }
    }

    return NextResponse.json({ success: true, ticketCode });

  } catch (err: any) {
    console.error("Registration API Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
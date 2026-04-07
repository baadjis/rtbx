/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/utils/supabase/server';
import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { getConfirmationEmail, getBadgeDeliveryEmail } from '@/utils/email-templates';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { eventId, name, email, lang } = await request.json();
    const supabase = await createClient();

    // 1. Récupérer les détails complets de l'événement (y compris le branding et l'automatisation)
    const { data: event } = await supabase
      .from('events')
      .select('title, start_date, location, badge_automation_type, org_logo_url, sponsors_data')
      .eq('id', eventId)
      .single();

    if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });

    // 2. Générer un code ticket unique
    const ticketCode = `TKT-${crypto.randomUUID().split('-')[0].toUpperCase()}`;

    // 3. Insérer le participant dans la base de données
    const { data: regData, error: insertError } = await supabase.from('event_registrations').insert([{
      event_id: eventId,
      full_name: name,
      email: email,
      ticket_code: ticketCode,
      role: 'participant'
    }]).select().single();

    if (insertError) throw insertError;

    // 4. Préparer et envoyer l'e-mail de CONFIRMATION standard
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

    // 5. LOGIQUE D'AUTOMATISATION : Envoi immédiat du BADGE si configuré
    if (event.badge_automation_type === 'immediate') {
      try {
        // A. Appel à l'API Python pour générer le Badge PDF
        const pythonRes = await fetch("https://baadjis-utilitybox.hf.space/api/gen-event-badge", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "X-API-KEY": process.env.NEXT_PUBLIC_RTBX_API_SECRET_KEY || "" 
          },
          body: JSON.stringify({
            full_name: name,
            role: 'participant',
            ticket_code: ticketCode,
            event_name: event.title,
            org_logo: event.org_logo_url,
            sponsors: event.sponsors_data
          })
        });

        if (pythonRes.ok) {
          const { pdf_base64 } = await pythonRes.json();

          // B. Préparer le template du mail de livraison de badge
          const badgeHtml = getBadgeDeliveryEmail({
            userName: name,
            eventTitle: event.title,
            ticketCode: ticketCode
          }, lang);

          // C. Envoyer le mail avec le PDF en pièce jointe
          await resend.emails.send({
            from: 'RetailBox <events@rtbx.space>',
            to: email,
            subject: lang === 'fr' ? `Votre Badge d'accès : ${event.title}` : `Your Access Badge: ${event.title}`,
            html: badgeHtml,
            attachments: [
              {
                filename: `badge-${ticketCode}.pdf`,
                content: pdf_base64,
              },
            ],
          });

          // D. Marquer comme envoyé en DB
          await supabase.from('event_registrations').update({ badge_sent: true }).eq('id', regData.id);
        }
      } catch (badgeErr) {
        // On ne bloque pas l'inscription si l'envoi du badge échoue (le cron de rattrapage s'en chargera)
        console.error("Erreur envoi badge immédiat:", badgeErr);
      }
    }

    return NextResponse.json({ success: true, ticketCode });

  } catch (err: any) {
    console.error("Registration Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
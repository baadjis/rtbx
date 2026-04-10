/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/utils/supabase/server';
import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { getBadgeDeliveryEmail } from '@/utils/email-templates';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { eventId, lang } = await request.json();
    const supabase = await createClient();

    // 1. Récupérer la configuration complète de l'événement (Branding & Design)
    const { data: event } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();

    // 2. Récupérer les badges liés aux participants (Jointure avec registrations)
    const { data: badges } = await supabase
      .from('event_badges')
      .select('*, event_registrations(*)')
      .eq('event_id', eventId);

    if (!event || !badges) {
      return NextResponse.json({ error: "Data not found" }, { status: 404 });
    }

    const results = { sent: 0, failed: 0 };

    // 3. Boucle d'envoi massif
    for (const badge of badges) {
      const participant = badge.event_registrations;
      
      try {
        // A. Appel à l'API Python avec les réglages de design du BadgeBuilder
        const pythonRes = await fetch("https://baadjis-utilitybox.hf.space/api/gen-event-badge", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "X-API-KEY": process.env.NEXT_PUBLIC_RTBX_API_SECRET_KEY || "" 
          },
          body: JSON.stringify({
            full_name: participant.full_name,
            company: participant.company_name || "",
            role: badge.access_level || "participant",
            ticket_code: badge.ticket_code,
            event_name: event.title,
            org_logo: event.org_logo_url,
            sponsors: event.sponsors_data,
            // Nouveaux paramètres du BadgeBuilder :
            format: event.badge_format || 'A6',
            theme_color: event.theme_color,
            badge_settings: event.badge_settings,
            useful_info: event.useful_info
          })
        });

        if (!pythonRes.ok) throw new Error("Python PDF generation failed");
        
        const { pdf_base64 } = await pythonRes.json();

        // B. Génération du contenu HTML de l'email
        const htmlContent = getBadgeDeliveryEmail({
            userName: participant.full_name,
            eventTitle: event.title,
            ticketCode: badge.ticket_code
        }, lang);

        // C. Envoi via Resend (Domaine vérifié rtbx.space)
        await resend.emails.send({
          from: 'RetailBox Events <events@rtbx.space>', 
          to: participant.email,
          subject: lang === 'fr' ? `Votre Badge : ${event.title}` : `Your Badge: ${event.title}`,
          html: htmlContent,
          attachments: [
            {
              filename: `badge-${badge.ticket_code}.pdf`,
              content: pdf_base64,
            },
          ],
        });

        // D. Mise à jour du statut du badge
        await supabase.from('event_badges').update({ badge_sent: true }).eq('id', badge.id);
        
        results.sent++;
      } catch (err) {
        console.error(`Erreur d'envoi pour ${participant?.email}:`, err);
        results.failed++;
      }
    }

    return NextResponse.json({ 
        status: "completed", 
        sent: results.sent, 
        failed: results.failed 
    });

  } catch (err: any) {
    console.error("Global API Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
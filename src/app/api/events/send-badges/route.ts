/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/utils/supabase/server';
import { Resend } from 'resend';
import { NextResponse } from 'next/server';
// Import du template professionnel
import { getBadgeDeliveryEmail } from '@/utils/email-templates';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { eventId, orgLogo, sponsors, lang } = await request.json();
    const supabase = await createClient();

    // 1. Récupérer les infos de l'événement et des participants
    const { data: event } = await supabase.from('events').select('*').eq('id', eventId).single();
    const { data: participants } = await supabase.from('event_registrations').select('*').eq('event_id', eventId);

    if (!event || !participants) {
      return NextResponse.json({ error: "Data not found" }, { status: 404 });
    }

    const results = { sent: 0, failed: 0 };

    // 2. Boucle d'envoi massif
    for (const p of participants) {
      try {
        // A. Appel à l'API Python pour générer le Badge PDF (Calcul lourd déporté)
        const pythonRes = await fetch("https://baadjis-utilitybox.hf.space/api/gen-event-badge", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "X-API-KEY": process.env.NEXT_PUBLIC_RTBX_API_SECRET_KEY || "" 
          },
          body: JSON.stringify({
            full_name: p.full_name,
            company: p.company || "",
            role: p.role || "participant",
            ticket_code: p.ticket_code,
            event_name: event.title,
            org_logo: orgLogo,
            sponsors: sponsors
          })
        });

        if (!pythonRes.ok) throw new Error("Python PDF generation failed");
        
        const { pdf_base64 } = await pythonRes.json();

        // B. Génération du contenu HTML via le template "Splendide"
        const htmlContent = getBadgeDeliveryEmail({
            userName: p.full_name,
            eventTitle: event.title,
            ticketCode: p.ticket_code
        }, lang);

        // C. Envoi via Resend (Domaine rtbx.space)
        await resend.emails.send({
          from: 'RetailBox <contact@rtbx.space>', 
          to: p.email,
          subject: lang === 'fr' ? `Votre Badge : ${event.title}` : `Your Badge: ${event.title}`,
          html: htmlContent,
          attachments: [
            {
              filename: `badge-${p.ticket_code}.pdf`,
              content: pdf_base64,
            },
          ],
        });

        // D. Mise à jour du statut dans Supabase pour le suivi
        await supabase.from('event_registrations').update({ badge_sent: true }).eq('id', p.id);
        
        results.sent++;
      } catch (err) {
        console.error(`Erreur d'envoi pour ${p.email}:`, err);
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
import { createClient } from '@/utils/supabase/server';
import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { eventId, orgLogo, sponsors, lang } = await request.json();
  const supabase = await createClient();

  // 1. Récupérer les infos de l'événement et des participants
  const { data: event } = await supabase.from('events').select('*').eq('id', eventId).single();
  const { data: participants } = await supabase.from('event_registrations').select('*').eq('event_id', eventId);

  if (!event || !participants) return NextResponse.json({ error: "Data not found" }, { status: 404 });

  const results = { sent: 0, failed: 0 };

  // 2. Boucle d'envoi (On traite un par un pour éviter les timeouts)
  for (const p of participants) {
    try {
      // A. Appeler l'API Python pour générer le Badge PDF personnalisé
      const pythonRes = await fetch("https://baadjis-utilitybox.hf.space/api/gen-event-badge", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "X-API-KEY": process.env.NEXT_PUBLIC_RTBX_API_SECRET_KEY || "" 
        },
        body: JSON.stringify({
          full_name: p.full_name,
          company: p.company,
          role: p.role,
          ticket_code: p.ticket_code,
          event_name: event.title,
          org_logo: orgLogo,
          sponsors: sponsors
        })
      });

      const { pdf_base64 } = await pythonRes.json();

      // B. Envoyer l'email via Resend avec le PDF en pièce jointe
      await resend.emails.send({
        from: 'RetailBox <onboarding@resend.dev>', // À remplacer par ton domaine rtbx.space plus tard
        to: p.email,
        subject: lang === 'fr' ? `Votre Badge pour ${event.title}` : `Your Badge for ${event.title}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #1e293b;">
            <h1 style="color: #4f46e5;">Bonjour ${p.full_name} !</h1>
            <p>Votre inscription pour <strong>${event.title}</strong> est confirmée.</p>
            <p>Veuillez trouver ci-joint votre badge d'accès au format PDF. Présentez le QR Code à l'entrée.</p>
            <br />
            <p style="font-size: 12px; color: #94a3b8;">RetailBox - Facilitateur de business digital</p>
          </div>
        `,
        attachments: [
          {
            filename: `badge-${p.ticket_code}.pdf`,
            content: pdf_base64,
          },
        ],
      });

      // C. Marquer comme envoyé dans Supabase
      await supabase.from('event_registrations').update({ badge_sent: true }).eq('id', p.id);
      
      results.sent++;
    } catch (err) {
      console.error(`Erreur pour ${p.email}:`, err);
      results.failed++;
    }
  }

  return NextResponse.json({ status: "done", ...results });
}
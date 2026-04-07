/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { getBadgeDeliveryEmail } from '@/utils/email-templates';

const resend = new Resend(process.env.RESEND_API_KEY);
// Client Admin pour bypasser les restrictions et lire tous les événements
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_KEY! // Utilise la clé secrète "service_role"
);

export async function GET(request: Request) {
  // 1. Vérification de sécurité pour Vercel Cron
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const now = new Date();
  const results = { events_processed: 0, badges_sent: 0, errors: 0 };

  try {
    // 2. Récupérer les événements programmés (Scheduled)
    const { data: events } = await supabaseAdmin
      .from('events')
      .select('*')
      .eq('is_published', true)
      .eq('badge_automation_type', 'scheduled');

    if (!events) return NextResponse.json({ message: "No events to process" });

    for (const event of events) {
      // Calcul du timing : Est-on dans la fenêtre d'envoi (ex: 24h avant) ?
      const startTime = new Date(event.start_date);
      const diffInHours = (startTime.getTime() - now.getTime()) / (1000 * 60 * 60);
      const delay = event.badge_delay_hours || 24;

      // Si l'événement commence dans moins de X heures ET n'est pas encore passé
      if (diffInHours <= delay && diffInHours > -2) {
        results.events_processed++;

        // 3. Trouver les participants qui n'ont pas encore reçu leur badge
        const { data: participants } = await supabaseAdmin
          .from('event_registrations')
          .select('*')
          .eq('event_id', event.id)
          .eq('badge_sent', false)
          .limit(20); // On limite par lot pour ne pas faire sauter le timeout Vercel

        if (participants && participants.length > 0) {
          for (const p of participants) {
            try {
              // A. Demander le PDF à l'API Python (Hugging Face)
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
                  org_logo: event.org_logo_url,
                  sponsors: event.sponsors_data
                })
              });

              const { pdf_base64 } = await pythonRes.json();

              // B. Préparer le template d'email "Splendide"
              const htmlContent = getBadgeDeliveryEmail({
                userName: p.full_name,
                eventTitle: event.title,
                ticketCode: p.ticket_code
              }, 'fr'); // On pourrait stocker la langue du client en DB

              // C. Envoyer via Resend
              await resend.emails.send({
                from: 'RetailBox <events@rtbx.space>',
                to: p.email,
                subject: `Votre Badge : ${event.title}`,
                html: htmlContent,
                attachments: [{
                  filename: `badge-${p.ticket_code}.pdf`,
                  content: pdf_base64,
                }]
              });

              // D. Marquer comme envoyé
              await supabaseAdmin
                .from('event_registrations')
                .update({ badge_sent: true })
                .eq('id', p.id);

              results.badges_sent++;
            } catch (err) {
              console.error(`Erreur pour ${p.email}:`, err);
              results.errors++;
            }
          }
        }
      }
    }

    return NextResponse.json(results);

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
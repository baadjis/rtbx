/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { getBadgeDeliveryEmail } from '@/utils/email-templates';

const resend = new Resend(process.env.RESEND_API_KEY);

// Client Admin (Service Role) pour agir au nom du système (outrepasser le RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! 
);

export async function GET(request: Request) {
  // 1. Sécurité : Vérification du token Cron de Vercel
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const now = new Date();
  const results = { events_checked: 0, total_badges_sent: 0, errors: 0 };

  try {
    // 2. Récupérer les événements actifs dont l'envoi est programmé
    const { data: events, error: eventsError } = await supabaseAdmin
      .from('events')
      .select('*')
      .eq('is_published', true)
      .eq('badge_automation_type', 'scheduled');

    if (eventsError) throw eventsError;
    if (!events || events.length === 0) return NextResponse.json({ message: "No scheduled events found" });

    for (const event of events) {
      // 3. Logique de temps : Vérifier si on est dans la fenêtre (ex: 24h avant le début)
      const startTime = new Date(event.start_date);
      const diffInHours = (startTime.getTime() - now.getTime()) / (1000 * 60 * 60);
      const scheduledDelay = event.badge_delay_hours || 24;

      // On traite si l'événement commence dans moins de X heures
      if (diffInHours <= scheduledDelay && diffInHours > -1) {
        results.events_checked++;

        // 4. Trouver les badges non envoyés pour cet événement (Jointure avec le participant)
        const { data: badgesToSend } = await supabaseAdmin
          .from('event_badges')
          .select('*, event_registrations(*)')
          .eq('event_id', event.id)
          .eq('badge_sent', false)
          .limit(10); // Petit lot pour éviter les timeouts par itération

        if (badgesToSend && badgesToSend.length > 0) {
          for (const badge of badgesToSend) {
            const participant = badge.event_registrations;

            try {
              // A. Demander le PDF personnalisé au Backend Python
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
                  // Paramètres de design du BadgeBuilder
                  format: event.badge_format || 'A6',
                  theme_color: event.theme_color,
                  badge_settings: event.badge_settings,
                  useful_info: event.useful_info
                })
              });

              if (!pythonRes.ok) throw new Error("Python rendering failed");
              const { pdf_base64 } = await pythonRes.json();

              // B. Préparer le template HTML (par défaut en français pour le cron, ou selon event)
              const htmlContent = getBadgeDeliveryEmail({
                userName: participant.full_name,
                eventTitle: event.title,
                ticketCode: badge.ticket_code
              }, 'fr'); 

              // C. Envoi via Resend
              await resend.emails.send({
                from: 'RetailBox Events <events@rtbx.space>',
                to: participant.email,
                subject: `Votre Badge : ${event.title}`,
                html: htmlContent,
                attachments: [{
                  filename: `badge-${badge.ticket_code}.pdf`,
                  content: pdf_base64,
                }]
              });

              // D. Mise à jour du statut du badge (Succès)
              await supabaseAdmin
                .from('event_badges')
                .update({ badge_sent: true })
                .eq('id', badge.id);

              results.total_badges_sent++;

            } catch (err) {
              console.error(`Erreur pour badge ${badge.ticket_code}:`, err);
              results.errors++;
            }
          }
        }
      }
    }

    return NextResponse.json(results);

  } catch (globalError: any) {
    console.error("CRON FATAL ERROR:", globalError.message);
    return NextResponse.json({ error: globalError.message }, { status: 500 });
  }
}
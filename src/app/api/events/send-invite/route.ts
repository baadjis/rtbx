/* eslint-disable @typescript-eslint/no-explicit-any */
import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
// Import du template splendide
import { getInvitationEmail } from '@/utils/email-templates';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, eventId, lang } = await request.json();
    const supabase = await createClient();

    // 1. Récupérer les infos de l'événement et de l'organisateur
    const { data: event } = await supabase
      .from('events')
      .select('*, profiles(company)')
      .eq('id', eventId)
      .single();

    if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });

    // 2. Générer le token d'invitation unique de manière sécurisée (Node.js crypto)
    const token = crypto.randomUUID();
    
    // Sauvegarde en base de données
    await supabase.from('event_invitations').insert([{
        event_id: eventId,
        email: email,
        token: token,
        status: 'pending'
    }]);

    // 3. Préparer les données pour le template
    const inviteLink = `https://www.rtbx.space/events/${event.id}?token=${token}`;
    const orgName = event.profiles?.company || "RetailBox Partner";

    // 4. Générer le HTML via le template réutilisable
    const htmlContent = getInvitationEmail({
        orgName: orgName,
        eventTitle: event.title,
        inviteLink: inviteLink
    }, lang);

    // 5. Envoyer l'Email via Resend avec ton domaine pro
    const { data, error } = await resend.emails.send({
      from: 'RetailBox <contact@rtbx.space>', // Utilisation de ton domaine rtbx.space
      to: email,
      subject: lang === 'fr' ? `Invitation : ${event.title}` : `Invitation: ${event.title}`,
      html: htmlContent
    });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, id: data?.id });
    
  } catch (err: any) {
    console.error("API Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
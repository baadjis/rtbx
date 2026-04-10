/* eslint-disable @typescript-eslint/no-explicit-any */
import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getInvitationEmail } from '@/utils/email-templates';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, eventId, lang } = await request.json();
    const supabase = await createClient();

    // 1. Récupérer les infos de l'événement et de l'organisateur (via jointure profiles)
    const { data: event } = await supabase
      .from('events')
      .select('*, profiles(company)')
      .eq('id', eventId)
      .single();

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // 2. Générer un token d'invitation unique (Sécurité Crypto Node.js)
    const token = crypto.randomUUID();
    
    // Sauvegarde du token dans la table invitations pour vérification ultérieure
    const { error: inviteError } = await supabase.from('event_invitations').insert([{
        event_id: eventId,
        email: email,
        token: token,
        status: 'pending'
    }]);

    if (inviteError) throw inviteError;

    // 3. Préparer le lien magique avec tracking d'origine
    // On ajoute 'origin=mail_invite' pour que le formulaire de destination capte la source
    const inviteLink = `https://www.rtbx.space/events/${event.id}?token=${token}&origin=mail_invite`;
    const orgName = event.profiles?.company || "RetailBox Partner";

    // 4. Générer le HTML via le template unifié
    const htmlContent = getInvitationEmail({
        orgName: orgName,
        eventTitle: event.title,
        inviteLink: inviteLink
    }, lang);

    // 5. Envoyer l'Email via ton domaine pro vérifié
    const { data, error } = await resend.emails.send({
      from: 'RetailBox Events <events@rtbx.space>',
      to: email,
      subject: lang === 'fr' 
        ? `Invitation : ${event.title}` 
        : `Invitation: ${event.title}`,
      html: htmlContent,
      // On ajoute un tag pour le tracking interne à Resend si besoin
      tags: [
        { name: 'category', value: 'invitation' },
        { name: 'event_id', value: eventId.toString() }
      ]
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Invitation envoyée avec succès",
      id: data?.id 
    });
    
  } catch (err: any) {
    console.error("Invitation API Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
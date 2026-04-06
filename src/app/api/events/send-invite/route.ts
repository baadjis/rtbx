/* eslint-disable @typescript-eslint/no-explicit-any */
import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, eventId, lang } = await request.json();
    const supabase = await createClient();

    // 1. Récupérer les infos de l'événement
    const { data: event } = await supabase.from('events').select('*, profiles(company)').eq('id', eventId).single();
    if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });

    // 2. Générer le token d'invitation unique
    const token = window.crypto.randomUUID();
    await supabase.from('event_invitations').insert([{
        event_id: eventId,
        email: email,
        token: token,
        status: 'pending'
    }]);

    const inviteLink = `https://www.rtbx.space/events/${event.id}?token=${token}`;
    const orgName = event.profiles?.company || "Un partenaire RetailBox";

    // 3. Envoyer l'Email avec le Template "Splendide"
    const { data, error } = await resend.emails.send({
      from: 'RetailBox <onboarding@resend.dev>',
      to: email,
      subject: lang === 'fr' ? `Invitation : ${event.title}` : `Invitation: ${event.title}`,
      html: `
        <div style="font-family: 'Plus Jakarta Sans', Helvetica, Arial, sans-serif; background-color: #f8fafc; padding: 40px 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
            <div style="background: linear-gradient(135deg, #4f46e5 0%, #9333ea 100%); padding: 40px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.02em;">${lang === 'fr' ? 'Invitation Exclusive' : 'Exclusive Invitation'}</h1>
            </div>
            <div style="padding: 40px; text-align: center;">
              <p style="color: #64748b; font-size: 16px; font-weight: 500;">${orgName} ${lang === 'fr' ? 'vous invite à' : 'invites you to'}:</p>
              <h2 style="color: #1e293b; font-size: 24px; font-weight: 800; margin: 10px 0 30px 0;">${event.title}</h2>
              
              <div style="background-color: #f1f5f9; border-radius: 16px; padding: 20px; margin-bottom: 30px; text-align: left;">
                <p style="margin: 0 0 10px 0; color: #475569; font-size: 14px;"><strong>📍 Lieu :</strong> ${event.location}</p>
                <p style="margin: 0; color: #475569; font-size: 14px;"><strong>📅 Date :</strong> ${new Date(event.start_date).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US')}</p>
              </div>

              <a href="${inviteLink}" style="display: inline-block; background-color: #4f46e5; color: #ffffff; padding: 16px 32px; border-radius: 12px; font-weight: 800; text-decoration: none; box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.3); transition: all 0.2s;">
                ${lang === 'fr' ? 'Confirmer ma présence' : 'Confirm my attendance'}
              </a>
            </div>
            <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #94a3b8; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin: 0;">Propulsé par RetailBox • www.rtbx.space</p>
            </div>
          </div>
        </div>
      `
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
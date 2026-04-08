/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

/**
 * Endpoint pour publier officiellement un événement.
 * Conçu pour être appelé par l'interface Web ou un Agent (MCP).
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // 1. Vérification de l'utilisateur (Session)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ 
        error: "Unauthorized", 
        message: "Vous devez être connecté pour publier un événement." 
      }, { status: 401 });
    }

    // 2. Récupération des paramètres
    const body = await request.json();
    const { eventId } = body;

    if (!eventId) {
      return NextResponse.json({ 
        error: "Bad Request", 
        message: "L'identifiant 'eventId' est requis." 
      }, { status: 400 });
    }

    // 3. Mise à jour de la base de données
    // On vérifie l'organizer_id dans la clause .eq pour la sécurité (Anti-ID-Snooping)
    const { data, error } = await supabase
      .from('events')
      .update({ 
        is_published: true,
        updated_at: new Date().toISOString() 
      })
      .eq('id', eventId)
      .eq('organizer_id', user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ 
        error: "Database Error", 
        message: error.message 
      }, { status: 500 });
    }

    // 4. Réponse structurée (Idéal pour les agents)
    return NextResponse.json({
      success: true,
      message: `L'événement "${data.title}" est désormais public.`,
      event: {
        id: data.id,
        status: "published",
        url: `https://www.rtbx.space/events/${data.id}`
      }
    });

  } catch (err: any) {
    return NextResponse.json({ 
      error: "Internal Server Error", 
      message: err.message 
    }, { status: 500 });
  }
}
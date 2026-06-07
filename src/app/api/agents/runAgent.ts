/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { runEventAgent } from '@/app/mcp/agents/event-agent';
import { mcpConfig } from '@/app/mcp/core/config';
import { createClient } from '@/utils/supabase/server';
import { LangType } from '@/lib/lang/types';

const Data = {
  fr: {
    rate_limit: "⏳ Limite de tokens atteinte. Veuillez réessayer dans quelques secondes.",
    connect_hint: "Veuillez vous connecter pour utiliser l'assistant.",
    internal_error: "Désolé, une erreur interne est survenue.",
    session_expired:"Votre session a expiré. Veuillez vous reconnecter."
  },
  en: {
    rate_limit: "⏳ Token limit reached. Please try again in a few seconds.",
    connect_hint: "Please log in to use the assistant.",
    internal_error: "Sorry, an internal error occurred.",
    session_expired:"session expired. Please reconnect."


  }
};

export async function PostRequest(request:Request,agent:string){

    let lang: LangType = 'fr';
      let t = Data[lang];
    
      try {
        const body = await request.json();
        lang = body.lang || 'fr';
        t = Data[lang];
    
        if (!body.messages || !Array.isArray(body.messages)) {
          return NextResponse.json({
            success: false,
            error: 'Messages array is required'
          }, { status: 400 });
        }
    
        // ==================== AUTHENTIFICATION ====================
        const supabase = await createClient();
    
        const { data: { user }, error: userError } = await supabase.auth.getUser();
    
        
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
        
    
        if (sessionError || userError || !session?.access_token || !user) {
          console.log("❌ Auth failed - No session or user");
          return NextResponse.json({
            success: false,
            text: t.connect_hint,
            needsAuth: true
          }, { status: 401 });
        }
    
        // Refresh automatique si le token expire bientôt (moins de 1 minute)
        let accessToken = session.access_token;
    
        if (session.expires_at && session.expires_at * 1000 < Date.now() + 60000) {
          console.log("🔄 Token presque expiré → Refresh en cours...");
          const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
    
          if (refreshError) {
            console.log("❌ Refresh failed:", refreshError.message);
            return NextResponse.json({
              success: false,
              text: t.session_expired,
              needsAuth: true
            }, { status: 401 });
          }
    
          if (refreshData.session?.access_token) {
            accessToken = refreshData.session.access_token;
          }
        }
    
    
        // ==================== APPEL DE L'AGENT ====================
        const result = await runEventAgent(body.messages, {
          temperature: body.temperature || mcpConfig.temperature,
          maxSteps: body.maxSteps || mcpConfig.maxSteps,
          accessToken: accessToken,           // Token frais
          userId: user.id,
          userEmail: user.email,
          eventId: body.eventId,
          mode: body.mode || 'ui', // ← 'ui' par défaut, 'text' pour clients API externes
    
        });
    
        if (!result.success) throw result.error;
    
        return NextResponse.json({
          success: true,
          text: result.text,
          ui: result.ui,
          toolCalls: result.toolCalls,
        });
    
      } catch (error: any) {
        console.error(`${agent} Agent Server Error:`, error);
    
        const errorStr = JSON.stringify(error).toLowerCase();
        if (errorStr.includes('rate limit') || errorStr.includes('429')) {
          return NextResponse.json({
            success: false,
            error: 'rate_limit',
            text: t.rate_limit
          }, { status: 429 });
        }
    
        return NextResponse.json({
          success: false,
          error: 'Internal server error',
          text: t.internal_error
        }, { status: 500 });
      }
}
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { getMyEvents } from '@/lib/events/service';
import { requireUser } from '@/lib/auth/get-user';
/**
 * =========================================================
 * GET /api/events/me
 * =========================================================
 *
 * Returns all events related to the authenticated user.
 *
 * Responsibilities:
 *
 * - requires authenticated user
 * - returns events organized by the user
 * - returns events the user registered to (matched by email)
 * - returns events the user was invited to (matched by email)
 * - all fetched in parallel for performance
 * 
 * Query params:
 * - limit: number (optional, default 10, max 20)
 * - offset: number (optional, default 0)
 *
 * This route is safe to expose to:
 *
 * - frontend user dashboard
 * - MCP tools (getMyEvents)
 * - mobile applications
 *
 * =========================================================
 */
export async function GET(request:Request) {
  try {
    const { user, error: authError } = await requireUser(request);
    if (!user) return NextResponse.json({ success: false, error: authError }, { status: 401 });
  console.log("user:",user.email ,user.id)
  console.log("=== API /events/me called ===");
  console.log("User from Supabase:", user?.id, user?.email);
  console.log("Authorization header received:", request.headers.get('Authorization')?.slice(0, 50) + "...");
      const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 20);
    const offset = parseInt(searchParams.get('offset') ?? '0');
  const { data, error } = await getMyEvents(user.id, user.email!,limit,offset);
    console.log(data)
    if (error) return NextResponse.json({ success: false, error }, { status: 400 });
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('EVENT_ME_ERROR:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}


/*export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    console.log("=== API /events/me BRUTE ===");
    console.log("User from getUser():", user?.id, user?.email);

    if (!user) {
      return NextResponse.json({ success: false, error: "No user" }, { status: 401 });
    }

    // Requête la plus simple possible
    const { data: organized, error: orgError } = await supabase
      .from('events')
      .select('*')
      .eq('organizer_id', user.id);

    console.log("Organized events found:", organized?.length);
    if (organized && organized.length > 0) {
      console.log("Sample event:", organized[0]);
    }

    return NextResponse.json({
      success: true,
      data: {
        organized: organized || [],
        registered: [],
        invited: []
      }
    });
  } catch (err) {
    console.error("ERROR in /api/events/me:", err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}*/


/*export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    console.log("=== DEBUG FINAL /events/me ===");
    console.log("User ID:", user?.id);
    console.log("User Email:", user?.email);

    if (!user) {
      return NextResponse.json({ success: false, error: "No user" }, { status: 401 });
    }

    // Requête la plus brute possible
    const { data: organized, error: orgError } = await supabase
      .from('events')
      .select('*')
      .eq('organizer_id', user.id);

    console.log("Organized events found:", organized?.length || 0);
    /*if (organized?.length > 0) {
      console.log("Event title:", organized[0].title);
    }

    return NextResponse.json({
      success: true,
      data: {
        organized: organized || [],
        registered: [],
        invited: []
      }
    });
  } catch (err: any) {
    console.error("CRITICAL ERROR in /events/me:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}*/
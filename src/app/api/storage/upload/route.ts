// app/api/storage/upload/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

const ALLOWED_BUCKETS: Record<string, string> = {
  'forms/image_choice': 'uploads_forms',
  'businesses':         'uploads_digitalid',
  // ajoute d'autres dossiers ici au besoin
};

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string;

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    if (!folder) return NextResponse.json({ error: 'No folder provided' }, { status: 400 });

    // Trouver le bon bucket selon le dossier
    const bucket = ALLOWED_BUCKETS[folder];
    if (!bucket) return NextResponse.json({ error: 'Invalid folder' }, { status: 400 });

    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return NextResponse.json({ url: publicUrlData.publicUrl });

  } catch (err: any) {
    console.error('Storage upload error:', err);
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 });
  }
}
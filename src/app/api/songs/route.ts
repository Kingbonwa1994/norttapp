import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { db } from '@/lib/db';
import { songs, stations } from '@/lib/db/schema';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const songFile = formData.get('song') as File;
    const title = formData.get('title') as string;
    const artist = formData.get('artist') as string;
    const album = formData.get('album') as string;
    const genre = formData.get('genre') as string;
    const userId = formData.get('userId') as string;

    // Upload to Supabase Storage
    const { data: storageData, error: storageError } = await supabase
      .storage
      .from('songs')
      .upload(`${userId}/${songFile.name}`, songFile);

    if (storageError) {
      return NextResponse.json({ error: storageError.message }, { status: 400 });
    }

    // Save to database
    const [songRecord] = await db.insert(songs).values({
      title,
      artist,
      album,
      genre,
      userId,
      storageUrl: storageData.path,
      status: 'pending'
    }).returning();

    // Find matching stations and send emails
    const matchingStations = await db.query.stations.findMany({
      where: (station, { like }) => like(station.genres, `%${genre}%`)
    });

    // Send emails to matching stations
    await Promise.all(matchingStations.map(station => 
      resend.emails.send({
        from: 'noreply@yourdomain.com',
        to: station.email,
        subject: `New Song Submission: ${title} by ${artist}`,
        html: `
          <h2>New Song Submission</h2>
          <p>Title: ${title}</p>
          <p>Artist: ${artist}</p>
          <p>Album: ${album}</p>
          <p>Genre: ${genre}</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/songs/${songRecord.id}">
            View Submission
          </a>
        `
      })
    ));

    return NextResponse.json({ success: true, song: songRecord });
  } catch (error) {
    console.error('Error processing song submission:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
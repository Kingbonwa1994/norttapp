import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { collaborations, notifications } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { senderId, receiverId, message, songId } = await req.json();

    const [collaboration] = await db.insert(collaborations).values({
      senderId,
      receiverId,
      message,
      songId,
      status: 'pending',
    }).returning();

    // Create notification
    await db.insert(notifications).values({
      userId: receiverId,
      type: 'collaboration_request',
      message: `You have a new collaboration request`,
      metadata: { collaborationId: collaboration.id },
    });

    // Send email notification
    await resend.emails.send({
      from: 'noreply@yourdomain.com',
      to: receiverEmail, // You'll need to fetch this
      subject: 'New Collaboration Request',
      html: `You have a new collaboration request. Check your notifications to respond.`,
    });

    return NextResponse.json({ collaboration });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create collaboration request' }, { status: 500 });
  }
}
// app/api/webhooks/telegram/setup/route.ts
// Appeler une seule fois pour enregistrer le webhook Telegram
import { NextResponse } from 'next/server';

export async function GET() {
  const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/telegram`;

  const res = await fetch(
    `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/setWebhook`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: webhookUrl,
        secret_token: process.env.TELEGRAM_WEBHOOK_SECRET,
        allowed_updates: ['message'],
      }),
    }
  );

  const data = await res.json();
  return NextResponse.json(data);
}
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getUserTransporter(userId: string) {
  // 1. Tokens ophalen uit Supabase
  const { data, error } = await supabase
    .from('user_gmail_tokens')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    throw new Error('Geen Gmail-account verbonden voor deze gebruiker.');
  }

  // 2. OAuth2-client opzetten met refresh_token
  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    process.env.GOOGLE_REDIRECT_URI!
  );

  oAuth2Client.setCredentials({
    refresh_token: data.refresh_token,
  });

  // 3. Nieuw access_token ophalen
  const { token } = await oAuth2Client.getAccessToken();
  if (!token) {
    throw new Error('Kon geen access_token verkrijgen via refresh_token.');
  }

  // 4. Nodemailer transporter maken
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: undefined, // optioneel: zet hier het echte e-mailadres als je dat weet
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      refreshToken: data.refresh_token,
      accessToken: token,
    },
  });

  return transporter;
}

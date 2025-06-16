import { google } from 'googleapis'

export const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  process.env.GOOGLE_REDIRECT_URI!
)

export const SCOPES = [
  'https://www.googleapis.com/auth/gmail.send',
  'openid',
  'email',
  'profile',
]

export function generateAuthUrl(state: string) {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: SCOPES,
    state, // gebruik Supabase user_id als identifier
  })
}

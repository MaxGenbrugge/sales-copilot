import type { SendMailOptions } from 'nodemailer';
import { getUserTransporter } from './getUserTransporter';

export async function sendUserMail(
  userId: string,
  options: SendMailOptions
) {
  const transporter = await getUserTransporter(userId);
  return transporter.sendMail(options);
}

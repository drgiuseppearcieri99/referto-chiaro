import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendReportEmail(params: { to: string; subject: string; html: string }) {
  return resend.emails.send({
    from: 'Referto Chiaro <onboarding@resend.dev>',
    to: params.to,
    subject: params.subject,
    html: params.html,
  });
}

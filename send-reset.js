import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, code } = req.body;

  if (!to || !code) {
    return res.status(400).json({ error: 'Missing email or code' });
  }

  try {
    await resend.emails.send({
      from: 'Engine6 <noreply@yourdomain.com>',   // Change after domain verification
      to: to,
      subject: 'Your Engine6 Password Reset Code',
      html: `
        <h2>Engine6 Password Reset</h2>
        <p style="font-size:18px">Your reset code is: <strong>${code}</strong></p>
        <p>This code will expire in 15 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to send email' });
  }
}
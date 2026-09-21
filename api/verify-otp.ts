import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl as string, supabaseServiceKey as string);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and OTP are required' });
  }

  // Fetch OTP record
  const { data, error } = await supabase
    .from('otps')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !data) {
    return res.status(400).json({ error: 'Invalid or expired OTP' });
  }

  // Check if expired
  if (new Date() > new Date(data.expires_at)) {
    // Optionally delete expired OTP
    await supabase.from('otps').delete().eq('email', email);
    return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
  }

  // Verify code
  if (data.otp !== otp.trim()) {
    return res.status(400).json({ error: 'Incorrect OTP' });
  }

  // Success! Delete the OTP record so it can't be reused
  await supabase.from('otps').delete().eq('email', email);

  return res.status(200).json({ success: true });
}

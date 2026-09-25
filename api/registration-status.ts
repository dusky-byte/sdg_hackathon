import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env['VITE_SUPABASE_URL'] || process.env['SUPABASE_URL'];
const supabaseServiceKey = process.env['SUPABASE_SERVICE_ROLE_KEY'];

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase credentials");
}

const supabase = createClient(supabaseUrl as string, supabaseServiceKey as string);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Add CORS headers for local development if needed
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

  try {
    // Fetch limit
    const { data: settingData, error: settingError } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'registration_limit')
      .maybeSingle();

    if (settingError) {
      console.error('Settings error:', settingError);
      // Fail open if there's no settings table yet
      if (settingError.code === '42P01') {
        return res.status(200).json({ isOpen: true });
      }
      return res.status(500).json({ error: 'Failed to fetch settings' });
    }

    if (!settingData || !settingData.value) {
      return res.status(200).json({ isOpen: true, count: 0, limit: null });
    }

    const limit = parseInt(settingData.value, 10);

    // Fetch count securely bypassing RLS
    const { count, error: countError } = await supabase
      .from('registrations')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Count error:', countError);
      return res.status(500).json({ error: 'Failed to count registrations' });
    }

    const isOpen = (count !== null) && (count < limit);
    return res.status(200).json({ isOpen, count, limit });
  } catch (err) {
    console.error('API error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

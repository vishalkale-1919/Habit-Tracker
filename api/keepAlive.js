import { createClient } from '../server/supabase';

// Use Service Role Key to bypass RLS for maintenance tasks
const supabase = createClient(
  process.env.SUPABASE_URL, 
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  
  try {
    // 1. Write to DB to reset inactivity timer
    const { error: insertError } = await supabase
      .from('health_checks')
      .insert([{ status: 'active' }]);
    if (insertError) throw insertError;

    // 2. Cleanup old records
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    await supabase.from('health_checks').delete().lt('created_at', yesterday);

    return res.status(200).json({ success: true, message: "Pulse Received" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
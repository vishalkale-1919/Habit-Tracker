import { createClient } from '@supabase/supabase-js';

// Initialize a dedicated admin client for the maintenance pulse
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL, 
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  // Allow only GET requests (from your GitHub Action)
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // 1. Write to DB to reset the Supabase inactivity timer
    const { error: insertError } = await supabaseAdmin
      .from('health_checks')
      .insert([{ status: 'active' }]);

    if (insertError) throw insertError;

    // 2. Cleanup old records (keep the table lean)
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    await supabaseAdmin
      .from('health_checks')
      .delete()
      .lt('created_at', yesterday);

    return res.status(200).json({ 
      success: true, 
      message: "Pulse Received",
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    console.error('Keep-Alive Error:', error.message);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}
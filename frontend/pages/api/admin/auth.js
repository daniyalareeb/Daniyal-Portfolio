export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  try {
    // Forward the request to the backend auth endpoint
    // Use server-side env var (more secure) or fallback to NEXT_PUBLIC_API_URL for compatibility
    // API_URL is server-side only and not exposed to client (more secure)
    // NEXT_PUBLIC_API_URL is exposed to client (less secure but needed for client-side code)
    const backendUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
    
    if (!backendUrl) {
      console.error('[AUTH] Backend URL not configured. Set API_URL or NEXT_PUBLIC_API_URL in environment variables.');
      return res.status(500).json({ 
        error: 'Backend URL not configured',
        details: 'Please set API_URL environment variable in Vercel settings'
      });
    }
    
    console.log('[AUTH] Calling backend:', `${backendUrl}/api/v1/login`);
    
    const response = await fetch(`${backendUrl}/api/v1/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    });

    console.log('[AUTH] Backend response status:', response.status);
    
    const result = await response.json();
    console.log('[AUTH] Backend response:', result);

    if (response.ok && result.success) {
      // Forward the Set-Cookie header from backend
      const setCookieHeader = response.headers.get('Set-Cookie');
      console.log('[AUTH] Set-Cookie header:', setCookieHeader ? 'Present' : 'Missing');
      
      if (setCookieHeader) {
        res.setHeader('Set-Cookie', setCookieHeader);
        console.log('[AUTH] Cookie forwarded to client');
      }
      res.status(200).json({ success: true });
    } else {
      console.error('[AUTH] Login failed:', result.detail || 'Invalid password');
      res.status(401).json({ error: result.detail || 'Invalid password' });
    }
  } catch (error) {
    console.error('[AUTH] Error:', error.message);
    res.status(500).json({ error: 'Authentication service unavailable' });
  }
}

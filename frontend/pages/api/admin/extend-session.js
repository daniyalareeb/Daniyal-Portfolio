export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Forward the request to the backend extend-session endpoint
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const response = await fetch(`${backendUrl}/api/v1/extend-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': req.headers.cookie || '', // Forward cookies
      },
    });

    const result = await response.json();

    if (response.ok && result.success) {
      // Forward the Set-Cookie header from backend
      const setCookieHeader = response.headers.get('Set-Cookie');
      if (setCookieHeader) {
        res.setHeader('Set-Cookie', setCookieHeader);
      }
      res.status(200).json({ success: true });
    } else {
      res.status(401).json({ error: result.detail || 'Session extension failed' });
    }
  } catch (error) {
    console.error('Extend session error:', error);
    res.status(500).json({ error: 'Session extension service unavailable' });
  }
}

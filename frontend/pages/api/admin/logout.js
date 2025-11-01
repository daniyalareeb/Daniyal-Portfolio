export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Forward the request to the backend logout endpoint
    const backendUrl = process.env.NEXT_PUBLIC_API_URL;
    
    if (!backendUrl) {
      console.error('[LOGOUT] Backend URL not configured');
      // Still clear cookie on frontend even if backend call fails
      res.setHeader('Set-Cookie', 'admin_session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
      return res.status(200).json({ success: true, message: 'Logged out successfully' });
    }
    const response = await fetch(`${backendUrl}/api/v1/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': req.headers.cookie || '', // Forward cookies
      },
    });

    // Always clear the cookie on the frontend side
    res.setHeader('Set-Cookie', 'admin_session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
    
    if (response.ok) {
      res.status(200).json({ success: true, message: 'Logged out successfully' });
    } else {
      res.status(200).json({ success: true, message: 'Logged out successfully' });
    }
  } catch (error) {
    console.error('Logout error:', error);
    // Even on error, clear the cookie
    res.setHeader('Set-Cookie', 'admin_session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  }
}
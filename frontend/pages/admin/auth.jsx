import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AdminAuth() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if already authenticated via session cookie
    const cookies = document.cookie.split(';');
    let hasValidSession = false;
    
    for (let cookie of cookies) {
      const [name] = cookie.trim().split('=');
      if (name === 'admin_session') {
        hasValidSession = true;
        break;
      }
    }
    
    if (hasValidSession) {
      router.push('/admin');
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies in the request
        body: JSON.stringify({ password }),
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        // Redirect to admin dashboard (session cookie is now set)
        // Small delay to ensure cookie is set
        setTimeout(() => {
          window.location.href = '/admin';
        }, 100);
      } else {
        setError('Invalid password. Please try again.');
      }
    } catch (err) {
      setError('Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-hero flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-brand-300 bg-clip-text text-transparent mb-4">
            Admin Access
          </h2>
          <p className="text-slate-300 text-lg">
            Enter your password to access the admin panel
          </p>
        </div>
        
        <div className="card p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-3 rounded-xl bg-white/5 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-brand-400 text-white placeholder-slate-400"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <div className="flex items-center gap-2 text-red-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">Authentication Error</span>
                </div>
                <p className="text-red-300 mt-1">{error}</p>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full px-6 py-3 rounded-xl font-medium transition-all ${
                  isLoading || !password.trim()
                    ? 'bg-slate-600 text-slate-400 cursor-not-allowed' 
                    : 'bg-brand-500 hover:bg-brand-600 text-white hover:shadow-lg hover:shadow-brand-500/25'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Authenticating...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

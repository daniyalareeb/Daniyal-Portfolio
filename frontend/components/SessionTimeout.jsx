import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';

export default function SessionTimeout() {
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const router = useRouter();
  const timersRef = useRef({
    sessionCheck: null,
    warningTimer: null,
    logoutTimer: null
  });

  const clearAllTimers = useCallback(() => {
    if (timersRef.current.sessionCheck) {
      clearInterval(timersRef.current.sessionCheck);
      timersRef.current.sessionCheck = null;
    }
    if (timersRef.current.warningTimer) {
      clearInterval(timersRef.current.warningTimer);
      timersRef.current.warningTimer = null;
    }
    if (timersRef.current.logoutTimer) {
      clearInterval(timersRef.current.logoutTimer);
      timersRef.current.logoutTimer = null;
    }
  }, []);

  const checkSession = useCallback(async () => {
    // Check if we're on an admin page
    if (!router.pathname.startsWith('/admin') || router.pathname === '/admin/auth' || router.pathname === '/admin/logout') {
      return;
    }

    try {
      // Check session by making a request to the backend
      const response = await fetch('/api/admin/extend-session', {
        method: 'POST',
        credentials: 'include'
      });

      if (!response.ok) {
        // Session invalid, redirect to auth
        router.push('/admin/auth');
        return;
      }

      // Session is valid, check if we need to show warning
      // For JWT tokens, we can't easily check expiry client-side
      // So we'll show warning based on time since last activity
      const lastActivity = localStorage.getItem('lastActivity');
      const now = Date.now();
      const timeSinceActivity = now - (lastActivity ? parseInt(lastActivity) : now);
      const warningThreshold = 25 * 60 * 1000; // 25 minutes
      const logoutThreshold = 30 * 60 * 1000; // 30 minutes

      if (timeSinceActivity > logoutThreshold) {
        // Session should have expired, redirect to auth
        router.push('/admin/auth');
        return;
      }

      if (timeSinceActivity > warningThreshold && !showWarning) {
        setShowWarning(true);
        const remainingTime = Math.max(0, Math.floor((logoutThreshold - timeSinceActivity) / 1000));
        setTimeLeft(remainingTime);
        
        // Start countdown
        const countdown = setInterval(() => {
          setTimeLeft(prev => {
            if (prev <= 1) {
              clearInterval(countdown);
              router.push('/admin/auth');
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        timersRef.current.logoutTimer = countdown;
      }
    } catch (error) {
      console.error('Session check failed:', error);
      // On error, redirect to auth for security
      router.push('/admin/auth');
    }
  }, [router, showWarning]);

  useEffect(() => {
    // Clear any existing timers
    clearAllTimers();

    // Check if we're on an admin page
    if (!router.pathname.startsWith('/admin') || router.pathname === '/admin/auth' || router.pathname === '/admin/logout') {
      return;
    }

    // Update last activity on user interaction
    const updateActivity = () => {
      localStorage.setItem('lastActivity', Date.now().toString());
    };

    // Add event listeners for user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });

    // Check session every 30 seconds
    timersRef.current.sessionCheck = setInterval(checkSession, 30000);
    
    // Initial check
    checkSession();

    return () => {
      clearAllTimers();
      events.forEach(event => {
        document.removeEventListener(event, updateActivity, true);
      });
    };
  }, [router.pathname, checkSession, clearAllTimers]);

  const extendSession = async () => {
    try {
      const response = await fetch('/api/admin/extend-session', {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        // Update last activity
        localStorage.setItem('lastActivity', Date.now().toString());
        setShowWarning(false);
        setTimeLeft(0);
        // Clear logout timer
        if (timersRef.current.logoutTimer) {
          clearInterval(timersRef.current.logoutTimer);
          timersRef.current.logoutTimer = null;
        }
      } else {
        router.push('/admin/auth');
      }
    } catch (error) {
      console.error('Session extension failed:', error);
      router.push('/admin/auth');
    }
  };

  const logout = () => {
    // Clear all timers
    clearAllTimers();
    // Clear activity tracking
    localStorage.removeItem('lastActivity');
    router.push('/admin/logout');
  };

  if (!showWarning) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Session Expiring Soon
          </h3>
          <p className="text-gray-600 mb-4">
            Your admin session will expire in <span className="font-bold text-red-600">{timeLeft}</span> seconds.
          </p>
          <div className="flex gap-3">
            <button
              onClick={extendSession}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Extend Session
            </button>
            <button
              onClick={logout}
              className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

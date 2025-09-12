import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function BrowserCloseHandler() {
  const router = useRouter();

  useEffect(() => {
    // Only run on admin pages
    if (!router.pathname.startsWith('/admin') || router.pathname === '/admin/auth' || router.pathname === '/admin/logout') {
      return;
    }

    const handleBeforeUnload = (event) => {
      // Clear session when browser/tab is closed
      document.cookie = 'admin_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'admin_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/admin;';
      
      // Clear any localStorage/sessionStorage admin data
      localStorage.removeItem('admin_session');
      sessionStorage.removeItem('admin_session');
      localStorage.removeItem('admin_auth');
      sessionStorage.removeItem('admin_auth');
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab is hidden, clear session after 5 minutes of inactivity
        setTimeout(() => {
          if (document.hidden) {
            document.cookie = 'admin_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            document.cookie = 'admin_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/admin;';
          }
        }, 5 * 60 * 1000); // 5 minutes
      }
    };

    // Add event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [router]);

  return null; // This component doesn't render anything
}

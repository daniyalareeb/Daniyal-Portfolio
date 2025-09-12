import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AdminLogout() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      try {
        // Call backend logout endpoint
        const response = await fetch('/api/admin/logout', {
          method: 'POST',
          credentials: 'include'
        });

        if (response.ok) {
          // Clear any local storage
          localStorage.removeItem('lastActivity');
          
          // Redirect to auth page
          router.push('/admin/auth');
        } else {
          // Even if logout fails, redirect to auth
          router.push('/admin/auth');
        }
      } catch (error) {
        console.error('Logout error:', error);
        // On error, still redirect to auth
        router.push('/admin/auth');
      }
    };

    logout();
  }, [router]);

  return (
    <div className="min-h-screen bg-hero flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white text-lg">Logging out...</p>
      </div>
    </div>
  );
}

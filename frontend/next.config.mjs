/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['images.unsplash.com'],
    unoptimized: true // For static export compatibility
  },
  // Optimize for production
  compress: true,
  poweredByHeader: false,
  
  // Handle API routes with proper error handling
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      console.warn('NEXT_PUBLIC_API_URL not set, API rewrites disabled');
      return [];
    }
    
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
        has: [
          {
            type: 'header',
            key: 'content-type',
            value: 'application/json'
          }
        ]
      }
    ];
  },
  
  // Add proper headers for security
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          }
        ]
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ];
  }
};

export default nextConfig;

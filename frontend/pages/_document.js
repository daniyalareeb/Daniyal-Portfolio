import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        
        {/* Version and Cache Busting */}
        <meta name="version" content="4.0.0" />
        <meta name="build-time" content="2025-01-16T15:00:00Z" />
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-QW5L3B3G34"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-QW5L3B3G34');
            `,
          }}
        />
        
        {/* SEO Meta Tags */}
        <meta name="description" content="Daniyal Ahmad (daniyalareeb) - AI & Backend Engineer Portfolio. Expert in FastAPI, LLMs, Next.js, Python, React. Building intelligent software solutions and modern web applications." />
        <meta name="title" content="Daniyal Ahmad | AI & Backend Engineer Portfolio" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Daniyal Ahmad | AI & Backend Engineer Portfolio" />
        <meta property="og:description" content="AI & Backend Engineer specializing in FastAPI, LLM agents, and modern web applications. Building the future of intelligent software." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://daniyalareeb.com" />
        <meta property="og:image" content="https://daniyalareeb.com/preview.png" />
        <meta property="og:site_name" content="daniyalareeb.com" />
        
        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Daniyal Ahmad | AI & Backend Engineer Portfolio" />
        <meta name="twitter:description" content="AI & Backend Engineer specializing in FastAPI, LLM agents, and modern web applications. Building the future of intelligent software." />
        <meta name="twitter:image" content="https://daniyalareeb.com/preview.png" />
        <meta name="twitter:creator" content="@daniyalareeb" />
        
        {/* Additional Meta Tags */}
        <meta name="keywords" content="daniyalareeb, Daniyal Ahmad, AI Engineer, Backend Developer, FastAPI, LLM, Next.js, Portfolio, Machine Learning, Python, React, Full Stack Developer, Software Engineer, Web Developer, Artificial Intelligence, Backend Development, API Development" />
        <meta name="author" content="Daniyal Ahmad (daniyalareeb)" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#4F46E5" />
        
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Daniyal Ahmad",
              "alternateName": "daniyalareeb",
              "url": "https://daniyalareeb.com",
              "jobTitle": "AI & Backend Engineer",
              "description": "AI & Backend Engineer specializing in FastAPI, LLM agents, and modern web applications",
              "knowsAbout": ["Artificial Intelligence", "Backend Development", "FastAPI", "Python", "Next.js", "React", "Machine Learning"],
              "sameAs": [
                "https://github.com/daniyalareeb",
                "https://linkedin.com/in/daniyalareeb"
              ]
            })
          }}
        />
        
        {/* Canonical URL - will be set per page */}
        
        {/* Favicon */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

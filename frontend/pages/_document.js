import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        
        {/* SEO Meta Tags */}
        <meta name="description" content="Portfolio of Daniyal Ahmad (aka daniyalareeb) — AI & Backend Engineer building innovative products with FastAPI, LLMs, and modern web technologies." />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Daniyal Ahmad | AI & Backend Engineer" />
        <meta property="og:description" content="AI & Backend Engineer specializing in FastAPI, LLM agents, and modern web applications. Building the future of intelligent software." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://daniyalareeb.me" />
        <meta property="og:image" content="https://daniyalareeb.me/preview.png" />
        <meta property="og:site_name" content="daniyalareeb.me" />
        
        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Daniyal Ahmad | AI & Backend Engineer" />
        <meta name="twitter:description" content="AI & Backend Engineer specializing in FastAPI, LLM agents, and modern web applications. Building the future of intelligent software." />
        <meta name="twitter:image" content="https://daniyalareeb.me/preview.png" />
        <meta name="twitter:creator" content="@daniyalareeb" />
        
        {/* Additional Meta Tags */}
        <meta name="keywords" content="daniyalareeb, Daniyal Ahmad, AI Engineer, Backend Developer, FastAPI, LLM, Next.js, Portfolio, Machine Learning, Python, React, Full Stack Developer" />
        <meta name="author" content="Daniyal Ahmad (daniyalareeb)" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#4F46E5" />
        
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

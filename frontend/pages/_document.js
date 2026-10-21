import { Html, Head, Main, NextScript } from 'next/document'

const DESC = 'Daniyal Ahmad, London software engineer building AI agents: real-time voice interviewers, multi-agent company brains and school operations systems.'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* 8-bit is the default edition; set it before first paint so it doesn't flash. Only an explicit switch to painted sticks. */}
        <script dangerouslySetInnerHTML={{ __html: `try{localStorage.pixel!=='0'&&document.documentElement.classList.add('pixel')}catch(e){document.documentElement.classList.add('pixel')}` }} />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-3MSZ0CBER8"></script>
        <script dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-3MSZ0CBER8');` }} />
        <meta name="description" content={DESC} />
        <meta property="og:title" content="Daniyal Ahmad · Software Engineer" />
        <meta property="og:description" content={DESC} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://daniyalareeb.com" />
        <meta name="twitter:card" content="summary" />
        <meta name="author" content="Daniyal Ahmad" />
        <meta name="theme-color" content="#F4EDE0" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org', '@type': 'Person', name: 'Daniyal Ahmad', alternateName: 'daniyalareeb',
          url: 'https://daniyalareeb.com', jobTitle: 'Software Engineer', description: DESC,
          sameAs: ['https://github.com/daniyalareeb', 'https://linkedin.com/in/daniyalareeb'],
        }) }} />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

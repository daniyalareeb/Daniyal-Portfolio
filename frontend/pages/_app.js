import '../styles/globals.css'
import Head from 'next/head'
import Navbar from '../components/Navbar'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <title>Daniyal Ahmad | AI & Backend Engineer</title>
        <meta name="description" content="AI & Backend Engineer — building innovative products with FastAPI, LLMs, and modern web technologies." />
      </Head>
      <Navbar />
      <Component {...pageProps} />
    </>
  )
}

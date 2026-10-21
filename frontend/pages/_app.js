import '../styles/globals.css'
import Head from 'next/head'
import { Fraunces, Instrument_Sans, JetBrains_Mono, Pixelify_Sans, Press_Start_2P, VT323 } from 'next/font/google'

const display = Fraunces({ subsets: ['latin'], axes: ['SOFT', 'WONK', 'opsz'], style: ['normal', 'italic'], variable: '--f-display' })
const body = Instrument_Sans({ subsets: ['latin'], variable: '--f-body' })
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--f-mono' })
const pixel = Pixelify_Sans({ subsets: ['latin'], variable: '--f-pixel' })
const arcade = Press_Start_2P({ subsets: ['latin'], weight: '400', variable: '--f-arcade' })
const term = VT323({ subsets: ['latin'], weight: '400', variable: '--f-term' })

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Daniyal Ahmad · Software Engineer</title>
      </Head>
      <div className={`root ${display.variable} ${body.variable} ${mono.variable} ${pixel.variable} ${arcade.variable} ${term.variable}`}>
        <Component {...pageProps} />
      </div>
    </>
  )
}

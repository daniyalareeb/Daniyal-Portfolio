import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/router'

const links = [
  { href: '/', label: 'Home' },
  { href: '/#projects', label: 'Projects' },
  { href: '/tools', label: 'AI Tools' },
  { href: '/blog', label: 'Blog' },
  { href: '/chat', label: 'Chat with my CV' },
]

export default function Navbar(){
  const router = useRouter()

  const handleNavigation = (link) => {
    if (link.isAnchor) {
      // If we're not on homepage, navigate there first
      if (router.pathname !== '/') {
        router.push('/').then(() => {
          // Wait for navigation, then scroll to section
          setTimeout(() => {
            const element = document.querySelector(link.href)
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' })
            }
          }, 100)
        })
      } else {
        // Already on homepage, just scroll
        const element = document.querySelector(link.href)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }
  }

  return (
    <header className="sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <motion.nav
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="card flex items-center justify-between px-5 py-3"
        >
          <Link href="/" className="text-xl font-bold hover:text-brand-300 transition-colors">daniyalareeb</Link>
          <ul className="flex items-center gap-6 text-sm text-slate-200">
            {links.map(l => (
              <li key={l.href}>
                {l.isAnchor ? (
                  <button
                    onClick={() => handleNavigation(l)}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    {l.label}
                  </button>
                ) : (
                  <Link href={l.href} className="hover:text-white transition-colors">
                    {l.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
          <Link href="/contact" className="btn">Contact</Link>
        </motion.nav>
      </div>
    </header>
  )
}

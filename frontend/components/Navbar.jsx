import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'

const links = [
  { href: '/', label: 'Home' },
  { href: '/#projects', label: 'Projects' },
  { href: '/tools', label: 'AI Tools' },
  { href: '/blog', label: 'Blog' },
  { href: '/chat', label: 'Chat with my CV' },
]

export default function Navbar(){
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
    // Close mobile menu after navigation
    setIsMobileMenuOpen(false)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header className="sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4">
        <motion.nav
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="card flex items-center justify-between px-3 sm:px-5 py-3"
        >
          {/* Logo */}
          <Link href="/" className="text-lg sm:text-xl font-bold hover:text-brand-300 transition-colors">
            daniyalareeb
          </Link>
          
          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-6 text-sm text-slate-200">
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
          
          {/* Desktop Contact Button */}
          <Link href="/contact" className="hidden md:block btn">
            Contact
          </Link>
          
          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 text-slate-200 hover:text-white transition-colors"
            aria-label="Toggle mobile menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </motion.nav>
      </div>
      
      {/* Mobile Side Slider */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={toggleMobileMenu}
            />
            
            {/* Side Slider */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-slate-900 border-l border-slate-700 z-50 md:hidden"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-bold text-white">Menu</h2>
                  <button
                    onClick={toggleMobileMenu}
                    className="p-2 text-slate-400 hover:text-white transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {/* Navigation Links */}
                <nav className="space-y-4">
                  {links.map((link, index) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {link.isAnchor ? (
                        <button
                          onClick={() => handleNavigation(link)}
                          className="w-full text-left px-4 py-3 text-slate-200 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                        >
                          {link.label}
                        </button>
                      ) : (
                        <Link
                          href={link.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block px-4 py-3 text-slate-200 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                        >
                          {link.label}
                        </Link>
                      )}
                    </motion.div>
                  ))}
                </nav>
                
                {/* Contact Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mt-8 pt-6 border-t border-slate-700"
                >
                  <Link
                    href="/contact"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Contact
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}

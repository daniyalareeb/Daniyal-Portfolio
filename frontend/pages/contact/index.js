import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ApiClient } from '../../lib/api'
import Footer from '../../components/Footer'

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" })
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await ApiClient.submitContact(form.name, form.email, form.message)
    setSubmitted(true)
    setForm({ name: "", email: "", message: "" })
    } catch (error) {
      console.error('Contact error:', error)
      setError("Failed to send message. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-hero">
      <div className="pt-24 pb-8">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-brand-300 bg-clip-text text-transparent">
              Contact Me
            </h1>
            <p className="text-xl text-slate-300 mb-6 text-center max-w-3xl mx-auto leading-relaxed">
          Want to collaborate or hire me? Fill the form below and your message will be delivered directly to my inbox.
        </p>
            <div className="flex justify-center items-center gap-4 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Quick Response</span>
              </div>
              <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
              <span>Professional</span>
              <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
              <span>Available for Projects</span>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Form */}
        <motion.form
          onSubmit={handleSubmit}
              className="card p-8 space-y-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-2xl font-semibold text-white mb-6">Send a Message</h2>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Your Name</label>
          <input
            type="text"
            name="name"
                  placeholder="Enter your name"
            value={form.name}
            onChange={handleChange}
            required
                  disabled={isLoading}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-brand-400 text-white placeholder-slate-400"
          />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Your Email</label>
          <input
            type="email"
            name="email"
                  placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            required
                  disabled={isLoading}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-brand-400 text-white placeholder-slate-400"
          />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Your Message</label>
          <textarea
            name="message"
                  placeholder="Tell me about your project or collaboration idea..."
            value={form.message}
            onChange={handleChange}
            required
            rows="5"
                  disabled={isLoading}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-brand-400 text-white placeholder-slate-400 resize-none"
          />
              </div>
              
          <button
            type="submit"
                disabled={isLoading}
                className={`w-full px-6 py-3 rounded-xl font-medium transition-all ${
                  isLoading || !form.name.trim() || !form.email.trim() || !form.message.trim()
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                    : 'bg-brand-500 hover:bg-brand-600 text-white hover:shadow-lg hover:shadow-brand-500/25'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Sending...</span>
                  </div>
                ) : (
                  'Send Message'
                )}
          </button>
        </motion.form>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="card p-8"
            >
              <h2 className="text-2xl font-semibold text-white mb-6">Let&apos;s Connect</h2>
              <p className="text-slate-300 mb-8 leading-relaxed">
                Ready to bring your ideas to life? I&apos;m always excited to discuss new projects, 
                collaborations, or opportunities. Reach out through any of these channels.
              </p>
              
              <div className="space-y-6">
                <div className="group flex items-start gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-brand-500/30">
                  <div className="w-12 h-12 bg-gradient-to-br from-brand-500/30 to-brand-600/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-brand-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-white mb-1 group-hover:text-brand-300 transition-colors">Email</h3>
                    <p className="text-slate-300 mb-3 font-mono text-sm">daniyalareeb123@gmail.com</p>
                    <Link 
                      href="mailto:daniyalareeb123@gmail.com" 
                      className="inline-flex items-center gap-2 text-brand-300 hover:text-brand-200 transition-colors group-hover:gap-3 duration-300"
                    >
                      <span>Send Email</span>
                      <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </div>

                <div className="group flex items-start gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-blue-500/30">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500/30 to-blue-600/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-blue-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-white mb-1 group-hover:text-blue-300 transition-colors">LinkedIn</h3>
                    <p className="text-slate-300 mb-3">Professional networking &amp; career opportunities</p>
                    <Link 
                      href="https://www.linkedin.com/in/daniyalareeb" 
                      target="_blank" 
                      className="inline-flex items-center gap-2 text-blue-300 hover:text-blue-200 transition-colors group-hover:gap-3 duration-300"
                    >
                      <span>Connect with me</span>
                      <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </div>

                <div className="group flex items-start gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-gray-500/30">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-500/30 to-gray-600/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-white mb-1 group-hover:text-gray-300 transition-colors">GitHub</h3>
                    <p className="text-slate-300 mb-3">Explore my code, projects & contributions</p>
                    <Link 
                      href="https://github.com/daniyalareeb" 
                      target="_blank" 
                      className="inline-flex items-center gap-2 text-gray-300 hover:text-gray-200 transition-colors group-hover:gap-3 duration-300"
                    >
                      <span>View my work</span>
                      <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>

            </motion.div>
          </div>

          {error && (
            <motion.div
              className="mt-6 card p-4 bg-red-500/10 border-red-500/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
              <div className="flex items-center gap-2 text-red-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">Error</span>
              </div>
              <p className="text-red-300 mt-1">{error}</p>
            </motion.div>
          )}

          {submitted && (
            <motion.div
              className="mt-6 card p-4 bg-green-500/10 border-green-500/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex items-center gap-2 text-green-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">Success!</span>
          </div>
              <p className="text-green-300 mt-1">Message sent successfully! I&apos;ll get back to you soon.</p>
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}

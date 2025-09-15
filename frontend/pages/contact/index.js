import { useState } from 'react'
import { motion } from 'framer-motion'
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
      <div className="pt-20 md:pt-24 pb-8">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-white to-brand-300 bg-clip-text text-transparent">
              Contact Me
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-4 md:mb-6 text-center max-w-3xl mx-auto leading-relaxed px-4">
          Want to collaborate or hire me? Fill the form below and your message will be delivered directly to my inbox.
        </p>
            <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4 text-xs md:text-sm text-slate-400 px-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Quick Response</span>
              </div>
              <div className="w-1 h-1 bg-slate-500 rounded-full hidden md:block"></div>
              <span className="hidden md:inline">Professional</span>
              <div className="w-1 h-1 bg-slate-500 rounded-full hidden md:block"></div>
              <span className="hidden md:inline">Available for Projects</span>
            </div>
          </motion.div>

          <div className="max-w-2xl mx-auto">
            {/* Contact Form */}
        <motion.form
          onSubmit={handleSubmit}
              className="card p-4 md:p-8 space-y-4 md:space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 md:mb-6">Send a Message</h2>
              
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
                  className="w-full px-3 md:px-4 py-2 md:py-3 rounded-xl bg-white/5 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-brand-400 text-white placeholder-slate-400 text-sm md:text-base"
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
                  className="w-full px-3 md:px-4 py-2 md:py-3 rounded-xl bg-white/5 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-brand-400 text-white placeholder-slate-400 text-sm md:text-base"
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
                  className="w-full px-3 md:px-4 py-2 md:py-3 rounded-xl bg-white/5 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-brand-400 text-white placeholder-slate-400 resize-none text-sm md:text-base"
          />
              </div>
              
          <button
            type="submit"
                disabled={isLoading}
                className={`w-full px-4 md:px-6 py-2 md:py-3 rounded-xl font-medium transition-all text-sm md:text-base ${
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
          </div>

          {error && (
            <motion.div
              className="mt-4 md:mt-6 card p-3 md:p-4 bg-red-500/10 border-red-500/20 mx-4 md:mx-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
              <div className="flex items-center gap-2 text-red-300">
                <svg className="w-4 md:w-5 h-4 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium text-sm md:text-base">Error</span>
              </div>
              <p className="text-red-300 mt-1 text-sm md:text-base">{error}</p>
            </motion.div>
          )}

          {submitted && (
            <motion.div
              className="mt-4 md:mt-6 card p-3 md:p-4 bg-green-500/10 border-green-500/20 mx-4 md:mx-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex items-center gap-2 text-green-300">
                <svg className="w-4 md:w-5 h-4 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium text-sm md:text-base">Success!</span>
          </div>
              <p className="text-green-300 mt-1 text-sm md:text-base">Message sent successfully! I&apos;ll get back to you soon.</p>
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}

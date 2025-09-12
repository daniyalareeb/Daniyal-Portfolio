import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ApiClient } from '../../lib/api'
import Footer from '../../components/Footer'

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hi! I'm Daniyal Ahmad's AI assistant. Ask me anything about his skills, experience, or projects!" }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId] = useState(() => `session_${Date.now()}`)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const messagesContainerRef = useRef(null)

  const scrollToBottom = () => {
    setTimeout(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
      }
    }, 200)
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (!isLoading) {
      scrollToBottom()
    }
  }, [isLoading])

  // Ensure page starts from top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const sendMessage = async (e) => {
    if (e) e.preventDefault()
    if (!input.trim() || isLoading) return
    
    const userMessage = { role: 'user', text: input }
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await ApiClient.sendChatMessage(input, "cv")
      const aiMessage = { role: 'assistant', text: response.data.answer }
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Chat error:', error)
      let errorMessage = "Sorry, I'm having trouble connecting right now. Please try again later."
      
      if (error.message.includes('timeout')) {
        errorMessage = "The AI is taking longer than expected to respond. This can happen when the AI service is busy. Please try again in a moment."
      } else if (error.message.includes('Chat request failed')) {
        errorMessage = "There was an issue with the AI service. Please try again later."
      }
      
      const errorResponse = { role: 'assistant', text: errorMessage }
      setMessages(prev => [...prev, errorResponse])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-hero">
      {/* Header */}
      <div className="pt-24 pb-8">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-brand-300 bg-clip-text text-transparent">
              Chat with My CV
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Ask me anything about my background, skills, projects, or career goals. 
              I&apos;m powered by AI and have access to all my professional information!
            </p>
          </motion.div>
        </div>
      </div>

      {/* Terminal Chat Container */}
      <div className="max-w-5xl mx-auto px-6 pb-8">
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden shadow-2xl">
          {/* Terminal Header */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4 border-b border-slate-700/50">
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <span className="text-slate-300 font-mono text-lg">daniyal@cv-chat:~$</span>
              <div className="flex-1"></div>
              <div className="text-emerald-400 font-mono text-sm">● CV ASSISTANT ONLINE</div>
            </div>
          </div>

          {/* Terminal Messages Area */}
          <div ref={messagesContainerRef} className="h-[600px] overflow-y-auto p-6 bg-black/80 font-mono text-sm">
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-6"
              >
                {m.role === 'user' ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <span>user@terminal:~$</span>
                      <span className="animate-pulse">█</span>
                    </div>
                    <div className="text-white ml-4 whitespace-pre-wrap leading-relaxed">{m.text}</div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-blue-400">
                      <span>cv-assistant@daniyal:~$</span>
                    </div>
                    <div className="text-slate-300 ml-4 whitespace-pre-wrap leading-relaxed">{m.text}</div>
                  </div>
                )}
              </motion.div>
            ))}
            
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
              >
                <div className="flex items-center gap-2 text-blue-400">
                  <span>cv-assistant@daniyal:~$</span>
                </div>
                <div className="text-slate-300 ml-4 flex items-center gap-3">
                  <span>AI is thinking and generating response...</span>
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                    <div className="w-1 h-1 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                    <div className="w-1 h-1 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 bg-gradient-to-r from-black/5 to-black/10 border-t border-white/10">
            <div className="flex gap-4">
              <input
                ref={inputRef}
                className="flex-1 px-5 py-4 rounded-2xl bg-white/10 backdrop-blur-sm ring-1 ring-white/20 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:bg-white/15 text-white placeholder-slate-400 text-sm transition-all"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about Daniyal's skills, projects, or experience..."
                disabled={isLoading}
              />
              <button
                className={`px-8 py-4 rounded-2xl font-medium transition-all shadow-lg ${
                  isLoading || !input.trim()
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white hover:shadow-xl hover:shadow-brand-500/30 transform hover:scale-105'
                }`}
                onClick={(e) => sendMessage(e)}
                disabled={isLoading || !input.trim()}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span className="text-sm">Sending...</span>
                  </div>
                ) : (
                  <span className="text-sm font-semibold">Send</span>
                )}
              </button>
            </div>
            
            {/* Quick Suggestions */}
            <div className="mt-4 flex flex-wrap gap-3">
              {[
                "What are your technical skills?",
                "Tell me about your projects",
                "What's your experience with AI?",
                "What are your career goals?"
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setInput(suggestion)}
                  className="px-4 py-2 text-xs bg-white/10 hover:bg-white/20 text-slate-300 rounded-full transition-all hover:scale-105 backdrop-blur-sm border border-white/10"
                  disabled={isLoading}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

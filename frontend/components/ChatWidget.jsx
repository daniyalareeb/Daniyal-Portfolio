import { useState, useRef, useEffect } from 'react'
import { ApiClient } from '../lib/api'

export default function ChatWidget(){
  const [input, setInput] = useState('')
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const chatEndRef = useRef(null)
  const chatContainerRef = useRef(null)

  const scrollToBottom = () => {
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
      }
    }, 200)
  }

  useEffect(() => {
    scrollToBottom()
  }, [history])

  useEffect(() => {
    if (!loading) {
      scrollToBottom()
    }
  }, [loading])

  async function send(e){
    if (e) e.preventDefault()
    if(!input.trim()) return
    const msg = input
    setHistory(h => [...h, {role:'user', text: msg}])
    setInput('')
    setLoading(true)
    try{
      const r = await ApiClient.sendChatMessage(msg, "home")
      const text = r?.data?.answer || 'Backend not connected yet — using placeholder.'
      setHistory(h => [...h, {role:'bot', text}])
    }catch(err){
      console.error('Chat API error:', err)
      setHistory(h => [...h, {role:'bot', text:'Backend not connected yet — using placeholder.'}])
    }finally{ setLoading(false) }
  }

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden shadow-2xl">
      {/* Terminal Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-4 py-3 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <span className="text-slate-300 font-mono text-sm">daniyal@portfolio:~$</span>
          <div className="flex-1"></div>
          <div className="text-emerald-400 font-mono text-xs">● ONLINE</div>
        </div>
      </div>

      {/* Terminal Body */}
      <div ref={chatContainerRef} className="h-96 overflow-y-auto bg-black/80 p-4 font-mono text-sm">
        {history.length === 0 && (
          <div className="space-y-2 text-slate-400">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400">daniyal@portfolio:~$</span>
              <span className="animate-pulse">█</span>
            </div>
            <div className="text-slate-500 ml-4">
              Welcome to Daniyal Ahmad's AI Assistant
            </div>
            <div className="text-slate-500 ml-4">
              Type your questions about my experience, projects, or skills
            </div>
            <div className="text-slate-500 ml-4">
              Available commands: projects, skills, experience, contact
            </div>
          </div>
        )}
        
        {history.map((m,i)=> (
          <div key={i} className="mb-4">
            {m.role === 'user' ? (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-emerald-400">
                  <span>daniyal@portfolio:~$</span>
                  <span className="animate-pulse">█</span>
                </div>
                <div className="text-white ml-4">{m.text}</div>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-blue-400">
                  <span>ai-assistant@daniyal:~$</span>
                </div>
                <div className="text-slate-300 ml-4 whitespace-pre-wrap leading-relaxed">{m.text}</div>
              </div>
            )}
          </div>
        ))}
        
        {loading && (
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-blue-400">
              <span>ai-assistant@daniyal:~$</span>
            </div>
            <div className="text-slate-300 ml-4 flex items-center gap-2">
              <span>Processing your request</span>
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                <div className="w-1 h-1 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                <div className="w-1 h-1 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Terminal Input */}
      <div className="bg-slate-800/50 px-4 py-3 border-t border-slate-700/50">
        <div className="flex items-center gap-3">
          <span className="text-emerald-400 font-mono text-sm">daniyal@portfolio:~$</span>
          <input 
            value={input} 
            onChange={e=>setInput(e.target.value)} 
            onKeyPress={e => e.key === 'Enter' && send()}
            placeholder="Ask about my experience, projects, or skills..." 
            className="flex-1 bg-transparent text-white font-mono text-sm placeholder-slate-500 focus:outline-none" 
            disabled={loading}
          />
          {loading && (
            <div className="text-slate-500 font-mono text-sm">processing...</div>
          )}
        </div>
      </div>
    </div>
  )
}

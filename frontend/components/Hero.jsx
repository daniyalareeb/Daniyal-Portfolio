import { motion } from 'framer-motion'
import ThreeAvatar from './ThreeAvatar'
import ChatWidget from './ChatWidget'
// import P5Background from './P5Background'

export default function Hero(){
  return (
    <section className="relative overflow-hidden pt-20 md:pt-24">
      {/* <P5Background /> */}
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-12 md:py-20 grid grid-cols-12 gap-6 md:gap-12">
        <motion.div 
          initial={{opacity:0, y:20}} 
          whileInView={{opacity:1, y:0}} 
          viewport={{once:true}} 
          transition={{duration:0.8}} 
          className="col-span-12 lg:col-span-6 card p-4 md:p-8"
        >
          <div className="mb-6 md:mb-8">
            <ThreeAvatar />
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-white to-brand-300 bg-clip-text text-transparent">
            Hi, I'm Daniyal Ahmad
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-4 md:mb-6">Backend Engineer — building AI-powered products with FastAPI, LLMs & modern web tech.</p>
          <div className="mb-6 md:mb-8">
            <ChatWidget />
          </div>
        </motion.div>
        <motion.div 
          initial={{opacity:0, y:20}} 
          whileInView={{opacity:1, y:0}} 
          viewport={{once:true}} 
          transition={{duration:0.8, delay:0.2}} 
          className="col-span-12 lg:col-span-6 grid gap-4 md:gap-6"
        >
          <div className="card p-4 md:p-8">
            <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">What I do</h3>
            <p className="text-base md:text-lg text-slate-300 mb-4 md:mb-6">I am a Junior Software Engineer with hands-on experience in Python and building APIs with FastAPI. I am passionate about developing AI agents and training AI models.</p>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {['Python','FastAPI','AI Agents','Model Training','LLMs','RAG','Vector DBs','React.js','Node.js','MongoDB','Docker','Linux'].map(tag => (
                <span key={tag} className="px-3 md:px-4 py-1 md:py-2 rounded-full bg-brand-500/20 text-brand-300 ring-1 ring-brand-500/30 font-medium text-sm md:text-base">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="card p-4 md:p-8">
            <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Highlights</h3>
            <ul className="space-y-2 md:space-y-3 text-base md:text-lg text-slate-300">
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-brand-400 rounded-full"></span>
                Mini interactive chatbot on the homepage
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-brand-400 rounded-full"></span>
                AI news/blog generator from selected source
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-brand-400 rounded-full"></span>
                "Chat with my CV" (RAG) powered by AI
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

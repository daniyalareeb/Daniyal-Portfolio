import { motion } from 'framer-motion'

const skills = ['Python', 'Java', 'DSA', 'React.js', 'Node.js', 'REST APIs', 'ChromaDB', 'MongoDB', 'Model Fine-Tuning', 'LLMs', 'Transfer Learning', 'RAG', 'AI Agent', 'Docker', 'Proxmox VE', 'Linux', 'GitHub', 'Prompt Engineering', 'FastAPI', 'NumPy', 'Pandas']

export default function About(){
  return (
    <section id="about" className="py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">About Me</h2>
          <p className="text-base md:text-lg text-slate-300 max-w-3xl mx-auto px-4">
            I'm Daniyal Ahmad, a Software Engineer passionate about building AI-powered products that create real impact. I love developing and experimenting with AI agents and model training, and I thrive on turning ideas into impactful solutions by combining technical expertise with a strong focus on usability and innovation.
          </p>
        </motion.div>

        <div className="grid grid-cols-12 gap-4 md:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="col-span-12 lg:col-span-6 card p-4 md:p-8"
          >
            <h3 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">Who I Am</h3>
            <p className="text-sm md:text-base text-slate-300 mb-4 md:mb-6 leading-relaxed">
              My online identity is <strong>daniyalareeb</strong>, but professionally I'm known as <strong>Daniyal Ahmad</strong>.
              I love turning complex ideas into elegant, user-friendly applications. 
              My passion lies in backend engineering, AI integrations, and building intelligent systems.
            </p>
            <p className="text-sm md:text-base text-slate-300 leading-relaxed">
              I write clean, maintainable code and stay up-to-date with the latest technologies to deliver cutting-edge solutions.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="col-span-12 lg:col-span-6 card p-4 md:p-8"
          >
            <h3 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">Technical Skills</h3>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {skills.map(skill => (
                <span
                  key={skill}
                  className="px-3 md:px-4 py-1 md:py-2 rounded-full bg-brand-500/20 text-brand-300 ring-1 ring-brand-500/30 font-medium text-xs md:text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

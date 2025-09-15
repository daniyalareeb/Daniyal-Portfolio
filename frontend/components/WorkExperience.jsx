import { motion } from 'framer-motion'

const experiences = [
  {
    title: "Backend Developer",
    company: "Manage Your Sales",
    period: "2022",
    description: "Developed backend REST APIs for inventory and sales management, reducing processing time by 30%. Integrated automation scripts for data analysis, improving reporting speed by 25%. Collaborated with frontend teams, enhancing system performance and user experience.",
    technologies: ["Python", "FastAPI", "REST APIs", "Data Analysis", "Automation"]
  },
  {
    title: "Freelance Web Developer",
    company: "Self-Employed",
    period: "Summer 2024",
    description: "ShortInStay: Built a room booking system using Wix. SPY TARGET: Developed a service website to improve online engagement. The Food Station: Created an interactive restaurant website with booking features, increasing reservations by 40%.",
    technologies: ["Wix", "Web Development", "Booking Systems", "User Engagement"]
  }
]

export default function WorkExperience(){
  return (
    <section id="experience" className="py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">Work Experience</h2>
          <p className="text-base md:text-lg text-slate-300 max-w-3xl mx-auto px-4">
            My professional journey in software development, focusing on building innovative solutions and growing technical expertise.
          </p>
        </motion.div>

        <div className="space-y-6 md:space-y-8">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="card p-4 md:p-8"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3 md:mb-4">
                <div>
                  <h3 className="text-lg md:text-xl font-semibold text-white">{exp.title}</h3>
                  <p className="text-brand-300 font-medium text-sm md:text-base">{exp.company}</p>
                </div>
                <span className="text-slate-400 text-xs md:text-sm mt-1 md:mt-0">
                  {exp.period}
                </span>
              </div>
              
              <p className="text-sm md:text-base text-slate-300 mb-3 md:mb-4 leading-relaxed">
                {exp.description}
              </p>
              
              <div className="flex flex-wrap gap-1 md:gap-2">
                {exp.technologies.map(tech => (
                  <span
                    key={tech}
                    className="px-2 md:px-3 py-1 rounded-full bg-white/10 text-slate-200 text-xs font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <div className="card p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold mb-4">What I'm Looking For</h3>
            <p className="text-slate-300 mb-6">
              I'm seeking opportunities to work on challenging projects involving AI/ML, 
              building scalable backends, and creating innovative user experiences.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {['AI/ML Projects', 'Backend Development', 'Full-Stack Solutions', 'Innovation'].map(item => (
                <span
                  key={item}
                  className="px-4 py-2 rounded-full bg-brand-500/20 text-brand-300 ring-1 ring-brand-500/30 font-medium text-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

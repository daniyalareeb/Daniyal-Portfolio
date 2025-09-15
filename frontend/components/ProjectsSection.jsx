import Section from './Section'
import ProjectCard from './ProjectCard'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { ApiClient } from '../lib/api'

export default function ProjectsSection(){
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      setLoading(true)
      console.log('Loading projects...')
      const startTime = Date.now()
      const response = await ApiClient.getProjects()
      const endTime = Date.now()
      console.log(`Projects loaded in ${endTime - startTime}ms`)
      setProjects(response.data.items || [])
    } catch (error) {
      console.error('Failed to load projects:', error)
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Section id="projects" title="Projects" subtitle="Loading projects...">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-24 md:h-32 w-24 md:w-32 border-b-2 border-blue-600"></div>
        </div>
      </Section>
    )
  }

  return (
    <Section id="projects" title="Projects" subtitle="Turning innovative ideas into real-world solutions that make a difference.">
      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {projects.map((project, index) => (
          <motion.div 
            key={project.id} 
            initial={{opacity:0, y:20}} 
            whileInView={{opacity:1, y:0}} 
            viewport={{once:true}} 
            transition={{duration:0.5, delay: index * 0.1}}
          >
            <ProjectCard 
              title={project.name}
              description={project.description}
              tags={project.technologies ? project.technologies.split(/[,\s]+/).filter(tech => tech.trim()).map(tech => tech.trim()) : []}
              url={project.url}
              githubUrl={project.github_url}
              imageUrl={project.image_url}
            />
          </motion.div>
        ))}
      </div>
      
      {/* Empty State */}
      {projects.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="w-24 h-24 mx-auto mb-4 bg-white/5 rounded-full flex items-center justify-center ring-1 ring-white/10">
            <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <p className="text-slate-400 text-lg">No projects available at the moment.</p>
        </motion.div>
      )}
    </Section>
  )
}

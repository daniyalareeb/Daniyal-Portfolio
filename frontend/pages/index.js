import Hero from '../components/Hero'
import About from '../components/About'
import WorkExperience from '../components/WorkExperience'
import ProjectsSection from '../components/ProjectsSection'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <main className="bg-hero min-h-screen">
      <Hero />
      <About />
      <WorkExperience />
      <ProjectsSection />
      <Footer />
    </main>
  )
}

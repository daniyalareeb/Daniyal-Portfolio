import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { ApiClient } from '../../lib/api'
import Footer from '../../components/Footer'

export default function ToolsPage() {
  const [tools, setTools] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadTools()
  }, [])

  const loadTools = async () => {
    try {
      setLoading(true)
      // Add cache busting parameter
      const response = await ApiClient.getTools(null, null, 100)
      setTools(response.data.items || [])
    } catch (error) {
      console.error('Failed to load tools:', error)
      setTools([])
    } finally {
      setLoading(false)
    }
  }

  const filteredTools = tools.filter(tool => {
    const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const categories = ['All', ...new Set(tools.map(t => t.category))]

  if (loading) {
    return (
      <div className="pt-20 md:pt-24 px-4 md:px-6 flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-24 md:h-32 w-24 md:w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-hero">
      <div className="pt-20 md:pt-24 pb-6 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 md:mb-12"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-white to-brand-300 bg-clip-text text-transparent">
              AI Tools Directory
            </h1>
            <p className="text-base md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-3 md:mb-4 px-4">
              Discover the latest and greatest AI tools for content creation, design, and productivity. 
              From image generation to video creation, find the perfect AI tool for your needs.
            </p>
            <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4 text-xs md:text-sm text-slate-400">
              <div className="flex items-center gap-1 md:gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Live Updates</span>
              </div>
              <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
              <span>Curated by Daniyal Ahmad</span>
              <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
              <span>Free & Paid Options</span>
            </div>
          </motion.div>

          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 md:mb-12"
          >
            <div className="card p-4 md:p-6">
              <div className="flex flex-col lg:flex-row gap-3 md:gap-4 items-center">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search AI tools..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 md:px-4 py-2 md:py-3 pl-10 md:pl-12 rounded-xl bg-white/5 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-brand-400 text-white placeholder-slate-400 text-sm md:text-base"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap justify-center">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-xl transition-all ${
                        selectedCategory === category
                          ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25'
                          : 'bg-white/5 text-slate-300 hover:bg-white/10 ring-1 ring-white/10'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tools Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool, index) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card p-6 hover:shadow-lg hover:shadow-brand-500/10 transition-all duration-300 group"
              >
                {/* Tool Image */}
                {tool.image_url && (
                  <div className="mb-4">
                    <img 
                      src={`${process.env.NEXT_PUBLIC_API_URL}${tool.image_url}`} 
                      alt={tool.name}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
                
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-white group-hover:text-brand-300 transition-colors">
                    {tool.name}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    tool.status === 'Popular' ? 'bg-green-500/20 text-green-300 ring-1 ring-green-500/30' :
                    tool.status === 'Trending' ? 'bg-brand-500/20 text-brand-300 ring-1 ring-brand-500/30' :
                    tool.status === 'Professional' ? 'bg-purple-500/20 text-purple-300 ring-1 ring-purple-500/30' :
                    'bg-slate-500/20 text-slate-300 ring-1 ring-slate-500/30'
                  }`}>
                    {tool.status}
                  </span>
                </div>
                <p className="text-slate-300 mb-4 leading-relaxed">{tool.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-brand-300 bg-brand-500/10 px-3 py-1 rounded-full ring-1 ring-brand-500/20">
                    {tool.category}
                  </span>
                  <span className="text-sm text-slate-400">{tool.pricing}</span>
                </div>
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500/10 hover:bg-brand-500/20 text-brand-300 rounded-xl transition-all duration-200 hover:shadow-md hover:shadow-brand-500/25 ring-1 ring-brand-500/20 hover:ring-brand-500/40"
                >
                  <span>Visit Tool</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </motion.div>
            ))}
          </div>

          {filteredTools.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="card p-8 max-w-md mx-auto">
                <div className="w-16 h-16 bg-slate-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No Tools Found</h3>
                <p className="text-slate-400">Try adjusting your search or filter criteria to find more AI tools.</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}


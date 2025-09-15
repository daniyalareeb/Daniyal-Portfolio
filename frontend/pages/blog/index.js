import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { ApiClient } from '../../lib/api'
import Footer from '../../components/Footer'

export default function BlogPage() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedBlogs, setExpandedBlogs] = useState(new Set())

  useEffect(() => {
    loadBlogs()
  }, [])

  const loadBlogs = async () => {
    try {
      setLoading(true)
      const response = await ApiClient.getNews()
      setBlogs(response.data.items || [])
    } catch (error) {
      console.error('Failed to load blogs:', error)
      setBlogs([])
    } finally {
      setLoading(false)
    }
  }

  const toggleBlogExpansion = (blogId) => {
    setExpandedBlogs(prev => {
      const newSet = new Set(prev)
      if (newSet.has(blogId)) {
        newSet.delete(blogId)
      } else {
        newSet.add(blogId)
      }
      return newSet
    })
  }

  const filteredBlogs = blogs.filter(blog => {
    const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const featuredBlogs = filteredBlogs.filter(blog => blog.featured)
  const regularBlogs = filteredBlogs.filter(blog => !blog.featured)

  const categories = ['All', ...new Set(blogs.map(b => b.category))]

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
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-brand-300 bg-clip-text text-transparent">
              AI Insights & Analysis
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-6">
              Deep dives into artificial intelligence across industries. From healthcare to finance, 
              explore how AI is reshaping our world and what it means for the future.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500/10 text-brand-300 rounded-full ring-1 ring-brand-500/20">
              <div className="w-2 h-2 bg-brand-400 rounded-full animate-pulse"></div>
              <span className="text-sm">AI-Curated Content</span>
            </div>
            <p className="text-slate-400 text-sm mt-4 max-w-2xl mx-auto">
              Posts are generated from top AI research & news sources and written by AI, curated by Daniyal Ahmad.
            </p>
          </motion.div>

          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <div className="card p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search AI articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 pl-12 rounded-xl bg-white/5 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-brand-400 text-white placeholder-slate-400"
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
                      className={`px-3 py-2 rounded-xl transition-all text-sm ${
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

          {/* Featured Articles */}
          {featuredBlogs.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-white to-brand-300 bg-clip-text text-transparent">
                Featured Articles
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {featuredBlogs.map((blog, index) => (
                  <motion.article
                    key={blog.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="card p-6 bg-gradient-to-br from-brand-500/10 to-purple-500/10 border-brand-500/20 hover:border-brand-500/40 hover:shadow-lg hover:shadow-brand-500/10 transition-all duration-300"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-brand-500/20 text-brand-300 ring-1 ring-brand-500/30">
                        Featured
                      </span>
                      <span className="text-sm text-slate-400">{blog.readTime}</span>
                    </div>
                    <h3 className="text-2xl font-semibold mb-4 text-white hover:text-brand-300 transition-colors">{blog.title}</h3>
                    <p className="text-slate-300 mb-4 text-lg leading-relaxed">{blog.excerpt}</p>
                    
                    {/* Full content (expandable) */}
                    {expandedBlogs.has(blog.id) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mb-4 p-6 bg-gray-800/50 rounded-lg"
                      >
                        <p className="text-gray-200 text-base leading-relaxed whitespace-pre-wrap">{blog.content}</p>
                      </motion.div>
                    )}
                    
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm text-brand-300 bg-brand-500/10 px-3 py-1 rounded-full ring-1 ring-brand-500/20">
                        {blog.category}
                      </span>
                      <span className="text-sm text-slate-400">{blog.published}</span>
                    </div>
                    
                    {/* Read More/Read Less Button */}
                    <button
                      onClick={() => toggleBlogExpansion(blog.id)}
                      className="w-full px-4 py-2 bg-brand-500/10 hover:bg-brand-500/20 text-brand-300 rounded-xl transition-all duration-200 hover:shadow-md hover:shadow-brand-500/25 ring-1 ring-brand-500/20 hover:ring-brand-500/40"
                    >
                      {expandedBlogs.has(blog.id) ? 'Read Less' : 'Read More'}
                    </button>
                  </motion.article>
                ))}
              </div>
            </motion.div>
          )}

          {/* Regular Articles */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularBlogs.map((blog, index) => (
              <motion.article
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="card p-6 hover:shadow-lg hover:shadow-brand-500/10 transition-all duration-300 group"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm text-slate-400">{blog.readTime}</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-brand-300 transition-colors">{blog.title}</h3>
                <p className="text-slate-300 mb-4 text-base leading-relaxed">{blog.excerpt}</p>
                
                {/* Full content (expandable) */}
                {expandedBlogs.has(blog.id) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mb-4 p-4 bg-gray-800/50 rounded-lg"
                  >
                    <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">{blog.content}</p>
                  </motion.div>
                )}
                
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-brand-300 bg-brand-500/10 px-3 py-1 rounded-full ring-1 ring-brand-500/20">
                    {blog.category}
                  </span>
                  <span className="text-sm text-slate-400">{blog.published}</span>
                </div>
                
                {/* Read More/Read Less Button */}
                <button
                  onClick={() => toggleBlogExpansion(blog.id)}
                  className="w-full px-3 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl transition-all duration-200 ring-1 ring-white/10 hover:ring-white/20"
                >
                  {expandedBlogs.has(blog.id) ? 'Read Less' : 'Read More'}
                </button>
              </motion.article>
            ))}
          </div>

          {filteredBlogs.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="card p-8 max-w-md mx-auto">
                <div className="w-16 h-16 bg-slate-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No Articles Found</h3>
                <p className="text-slate-400">Try adjusting your search or filter criteria to find more AI articles.</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}

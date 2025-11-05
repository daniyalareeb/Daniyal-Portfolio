import { motion } from 'framer-motion'
import { useState } from 'react'

// Add a helper function to normalize URLs
function normalizeImageUrl(url) {
  if (!url) return url;
  
  // Fix malformed URLs (https// -> https://)
  if (url.startsWith('https//')) {
    return url.replace('https//', 'https://');
  }
  if (url.startsWith('http//')) {
    return url.replace('http//', 'http://');
  }
  
  // Check if it's a full URL (starts with http:// or https://)
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Otherwise, it's a relative path
  return `${process.env.NEXT_PUBLIC_API_URL}${url}`;
}

export default function ProjectCard({ title, description, tags = [], demo, url, githubUrl, imageUrl }){
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  return (
    <motion.div 
      whileHover={{ y:-4, scale: 1.01 }} 
      className="group card overflow-hidden h-full flex flex-col"
    >
      {/* Project Preview */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-slate-800/50 to-slate-900/50">
        {imageUrl && !imageError ? (
          <>
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <img 
                src={normalizeImageUrl(imageUrl)}
                alt={title}
                className={`max-w-full max-h-full object-contain transition-all duration-500 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
            </div>
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-slate-900/50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-brand-500/20 rounded-xl flex items-center justify-center ring-1 ring-brand-500/30">
                <svg className="w-6 h-6 text-brand-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <span className="text-slate-400 text-sm font-medium">Project Preview</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-4 md:p-6 space-y-3 md:space-y-4 flex-1 flex flex-col">
        {/* Title */}
        <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-brand-300 transition-colors duration-300">
          {title}
        </h3>
        
        {/* Description */}
        <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
          {description}
        </p>
        
        {/* Technologies */}
        <div className="flex flex-wrap gap-1 md:gap-2">
          {tags.map((tag, index) => (
            <span 
              key={index}
              className="px-2 md:px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-medium ring-1 ring-brand-500/30"
            >
              {tag}
            </span>
          ))}
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3 pt-2 mt-auto">
          {url && (
            <a 
              className="flex-1 btn text-sm" 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View Project
            </a>
          )}
          {githubUrl && (
            <a 
              className="flex-1 bg-white/10 hover:bg-white/20 text-white font-medium px-4 py-2 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ring-1 ring-white/20 hover:ring-white/30" 
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </a>
          )}
          {!githubUrl && (
            <div className="flex-1 bg-white/5 text-slate-400 font-medium px-4 py-2 rounded-xl flex items-center justify-center gap-2 ring-1 ring-white/10">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Coming Soon
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

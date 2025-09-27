import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import SessionTimeout from "../../components/SessionTimeout";
import BrowserCloseHandler from "../../components/BrowserCloseHandler";
import { safeFetch, fetchMultiple } from "../../utils/fetchWithTimeout";

export default function Admin() {
  const [tools, setTools] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [stats, setStats] = useState({});
  const [schedulerStatus, setSchedulerStatus] = useState({});
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const categories = [
    "AI Chat & Assistant", "Image & Visual AI", "Video & Media AI", "Audio & Voice AI", 
    "Development & Code", "Content Creation", "Productivity & Automation", "Design & UX",
    "Business & Marketing", "Research & Analytics", "Other"
  ];
  async function refreshBlogs() {
    setBusy(true);
    setMessage("Refreshing blogs and resetting timer...");
    const base = process.env.NEXT_PUBLIC_API_URL;
    
    const result = await safeFetch(`${base}/api/v1/refresh-blogs`, { 
      method: "POST", 
      headers: {
        'Content-Type': 'application/json'
      }
    }, 30000); // 30 second timeout for blog refresh
    
    if (result.success) {
      setMessage(`✅ ${result.data.message} - ${result.data.data?.added || 0} new blogs added`);
      await fetchAll();
      await fetchSchedulerStatus(); // Refresh scheduler status after manual refresh
    } else {
      setMessage(`❌ Error: ${result.error}`);
    }
    setBusy(false);
  }

  async function fetchSchedulerStatus() {
    const base = process.env.NEXT_PUBLIC_API_URL || 'https://kind-perfection-production-ae48.up.railway.app';
    try {
      const response = await fetch(`${base}/api/v1/scheduler-status`);
      const result = await response.json();
      if (result.success) {
        setSchedulerStatus({
          blog_schedule: 'Every 3 days',
          status: result.data.status,
          jobs: result.data.jobs
        });
      }
    } catch (error) {
      console.error('Error fetching scheduler status:', error);
    }
  }

  async function fetchAll() {
    const base = process.env.NEXT_PUBLIC_API_URL || 'https://kind-perfection-production-ae48.up.railway.app';
    
    const requests = [
      { url: `${base}/api/v1/tools/list`, options: {} },
      { url: `${base}/api/v1/projects/list`, options: {} },
      { url: `${base}/api/v1/news/list`, options: {} }
    ];
    
    const results = await fetchMultiple(requests);
    const [toolsRes, projectsRes, blogsRes] = results;
    
    // Extract data from working endpoints
    const toolsData = toolsRes.success ? (toolsRes.data?.data?.items || toolsRes.data?.items || []) : [];
    const projectsData = projectsRes.success ? (projectsRes.data?.data?.items || projectsRes.data?.items || []) : [];
    const blogsData = blogsRes.success ? (blogsRes.data?.data?.items || blogsRes.data?.items || []) : [];
    
    // Set the data
    setTools(toolsData.slice(0, 5)); // Show recent 5 tools
    setBlogs(blogsData.slice(0, 5)); // Show recent 5 blogs
    
    // Set stats with correct structure
    setStats({
      total_tools: toolsData.length,
      total_blogs: blogsData.length,
      total_projects: projectsData.length
    });
    
    // Set default scheduler status to show active
    setSchedulerStatus({
      blog_schedule: 'Every 3 days',
      status: 'running',
      jobs: [{
        id: 'blogs',
        next_run_time: null // Will be fetched from actual scheduler
      }]
    });
    
    // Show error if any request failed
    const errors = results.filter(r => !r.success).map(r => r.error);
    if (errors.length > 0) {
      setMessage(`Error fetching data: ${errors.join(', ')}`);
    }
  }



  useEffect(() => { 
    fetchAll();
    fetchSchedulerStatus();
  }, []);

  return (
    <>
      {/* <SessionTimeout /> */}
      <BrowserCloseHandler />
      <div className="min-h-screen bg-hero">
      <div className="pt-20 md:pt-24 pb-6 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="card p-6 md:p-8 mb-6 md:mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-brand-500/20 to-brand-600/20 rounded-xl flex items-center justify-center ring-1 ring-brand-500/30">
                  <svg className="w-6 h-6 text-brand-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-white to-brand-300 bg-clip-text text-transparent">
                    AI Portfolio Admin Dashboard
                  </h1>
                  <p className="text-lg text-slate-400">Auto-refresh management & content overview</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => window.location.href = '/admin/manual'}
                  className="btn flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Manual Management
                </button>
                <button
                  onClick={() => window.location.href = '/admin/logout'}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 font-medium transition-all duration-300 ring-1 ring-red-500/30"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          </motion.div>

          {/* Stats Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8"
          >
            <div className="card p-4 md:p-6 text-center group hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-brand-500/30 to-brand-600/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ring-1 ring-brand-500/30">
                <svg className="w-6 h-6 text-brand-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-white mb-2 group-hover:text-brand-300 transition-colors duration-300">{stats.total_tools || 0}</h3>
              <p className="text-slate-300">Total Tools</p>
            </div>
            
            <div className="card p-4 md:p-6 text-center group hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-emerald-500/30 to-emerald-600/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ring-1 ring-emerald-500/30">
                <svg className="w-6 h-6 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors duration-300">{stats.total_blogs || 0}</h3>
              <p className="text-slate-300">Total Blogs</p>
            </div>
            
            <div className="card p-4 md:p-6 text-center group hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-blue-500/30 to-blue-600/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ring-1 ring-blue-500/30">
                <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors duration-300">{stats.total_projects || 0}</h3>
              <p className="text-slate-300">Total Projects</p>
            </div>
          </motion.div>

          {/* Blog Update Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="card p-6 md:p-8 mb-6 md:mb-8"
          >
            <h3 className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500/30 to-blue-600/30 rounded-lg flex items-center justify-center ring-1 ring-blue-500/30">
                <svg className="w-4 h-4 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              Blog Update Status
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <div className="card p-4 text-center">
                <h4 className="text-brand-300 font-semibold mb-2">Schedule</h4>
                <p className="text-slate-300">{schedulerStatus.blog_schedule || 'Every 3 days'}</p>
              </div>
              <div className="card p-4 text-center">
                <h4 className="text-emerald-300 font-semibold mb-2">Status</h4>
                <p className="text-slate-300">
                  {schedulerStatus.status === 'running' ? '🟢 Active' : '🔴 Inactive'}
                </p>
              </div>
              <div className="card p-4 text-center">
                <h4 className="text-yellow-300 font-semibold mb-2">Next Update</h4>
                <p className="text-slate-300">
                  {schedulerStatus.jobs?.find(job => job.id === 'blogs')?.next_run_time ? 
                    new Date(schedulerStatus.jobs.find(job => job.id === 'blogs').next_run_time).toLocaleString() : 
                    'Calculating...'}
                </p>
              </div>
              <div className="card p-4 text-center">
                <h4 className="text-purple-300 font-semibold mb-2">Timer Status</h4>
                <p className="text-slate-300">
                  {schedulerStatus.jobs?.find(job => job.id === 'blogs')?.next_run_time ? 
                    '⏰ Active - Resets on manual refresh' : 
                    '⏸️ Inactive'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex gap-4 mb-6 md:mb-8"
          >
            <button 
              onClick={refreshBlogs} 
              disabled={busy}
              className="btn flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {busy ? "Refreshing..." : "Refresh Blogs"}
            </button>
          </motion.div>

          {/* Info Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="card p-6 md:p-8 mb-6 md:mb-8"
          >
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500/30 to-emerald-600/30 rounded-lg flex items-center justify-center ring-1 ring-emerald-500/30">
                <svg className="w-4 h-4 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              Content Overview
            </h3>
            <div className="space-y-3 text-slate-300">
              <p>✅ <strong>Automatic Blog Updates:</strong> Blogs are automatically fetched every 3 days from RSS sources</p>
              <p>✅ <strong>Manual Tool Management:</strong> Tools are added/removed manually for quality control</p>
              <p>✅ <strong>AI/ML Focused Categories:</strong> Professional categories for better organization</p>
              <p>✅ <strong>Smart Limits:</strong> Maximum 10 blogs per category, auto-removes oldest when adding new ones</p>
            </div>
          </motion.div>

          {/* Status Message */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="card p-4 mb-6 md:mb-8 bg-gradient-to-r from-brand-500/10 to-emerald-500/10 border-brand-500/20"
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-brand-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-brand-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-white font-medium">{message}</p>
              </div>
            </motion.div>
          )}

          {/* Tools Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="card p-6 md:p-8 mb-6 md:mb-8"
          >
            <h2 className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-brand-500/30 to-brand-600/30 rounded-lg flex items-center justify-center ring-1 ring-brand-500/30">
                <svg className="w-4 h-4 text-brand-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              Recent AI Tools
            </h2>
            <div className="space-y-4">
              {tools.map(t => (
                <div key={t.id} className="card p-4 hover:scale-105 transition-all duration-300">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="text-white font-semibold mb-2">{t.name}</h4>
                      <span className="inline-block px-3 py-1 bg-brand-500/20 text-brand-300 rounded-full text-sm ring-1 ring-brand-500/30">
                        {t.category}
                      </span>
                    </div>
                    <a 
                      href={t.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Visit
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Blogs Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="card p-6 md:p-8"
          >
            <h2 className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500/30 to-emerald-600/30 rounded-lg flex items-center justify-center ring-1 ring-emerald-500/30">
                <svg className="w-4 h-4 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              Recent Blogs
            </h2>
            <div className="space-y-4">
              {blogs.map(b => (
                <div key={b.id} className="card p-4 hover:scale-105 transition-all duration-300">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="text-white font-semibold mb-2">{b.title}</h4>
                      <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-sm ring-1 ring-emerald-500/30">
                        {b.category}
                      </span>
                    </div>
                    {b.url && (
                      <a 
                        href={b.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Read
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      </div>
    </>
  );
}

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SessionTimeout from "../../components/SessionTimeout";
import BrowserCloseHandler from "../../components/BrowserCloseHandler";
import DragDropList, { DragHandle } from "../../components/DragDropList";

export default function ManualAdmin() {
  const [activeTab, setActiveTab] = useState("tools");
  const [stats, setStats] = useState({});
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [tools, setTools] = useState([]);
  const [projects, setProjects] = useState([]);
  const [blogs, setBlogs] = useState([]);

  // Edit states
  const [editingProject, setEditingProject] = useState(null);
  const [editingTool, setEditingTool] = useState(null);

  // Tool form state
  const [toolForm, setToolForm] = useState({
    name: "",
    description: "",
    url: "",
    category: "AI Chat & Assistant",
    pricing: "",
    status: "Active",
    image_url: ""
  });

  // Project form state
  const [projectForm, setProjectForm] = useState({
    name: "",
    description: "",
    url: "",
    github_url: "",
    category: "Web Development",
    technologies: "",
    image_url: ""
  });

  // Blog generation state
  const [blogForm, setBlogForm] = useState({
    topic: "",
    category: "Technology",
    tone: "professional",
    length: "medium"
  });
  const [generatedBlog, setGeneratedBlog] = useState(null);

  const categories = [
    "AI Chat & Assistant", "Image & Visual AI", "Video & Media AI", "Audio & Voice AI", 
    "Development & Code", "Content Creation", "Productivity & Automation", "Design & UX",
    "Business & Marketing", "Research & Analytics", "Other"
  ];

  const projectCategories = [
    "Web Development", "Mobile Development", "AI/ML", "Data Science",
    "DevOps", "UI/UX Design", "Open Source", "Other"
  ];

  const blogCategories = [
    "AI Research & Development", "Machine Learning", "AI Applications", 
    "AI Business & Industry", "AI Ethics & Policy", "AI Tools & Platforms", 
    "AI News & Trends", "Other"
  ];

  async function fetchStats() {
    const base = process.env.NEXT_PUBLIC_API_URL || 'https://kind-perfection-production-ae48.up.railway.app';
    
    try {
      setMessage("🔄 Loading data...");
      
      const [toolsRes, projectsRes, blogsRes] = await Promise.all([
        fetch(`${base}/api/v1/tools/list`),
        fetch(`${base}/api/v1/projects/list`),
        fetch(`${base}/api/v1/news/list`)
      ]);
      
      const toolsResult = await toolsRes.json();
      const projectsResult = await projectsRes.json();
      const blogsResult = await blogsRes.json();
      
      // Extract data with correct structure
      const toolsData = toolsResult.success ? (toolsResult.data?.items || []) : [];
      const projectsData = projectsResult.success ? (projectsResult.data?.items || []) : [];
      const blogsData = blogsResult.success ? (blogsResult.data?.items || []) : [];
      
      setTools(toolsData);
      setProjects(projectsData);
      setBlogs(blogsData);
      
      // Set stats
      setStats({
        tools: toolsData.length,
        projects: projectsData.length,
        blogs: blogsData.length
      });
      
      setMessage(`✅ Loaded ${toolsData.length} tools, ${projectsData.length} projects, ${blogsData.length} blogs`);
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(""), 3000);
      
    } catch (error) {
      console.error('Fetch error:', error);
      setMessage(`❌ Error fetching data: ${error.message}`);
    }
  }

  // Drag and drop reorder functions
  async function reorderTools(newOrder) {
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || 'https://kind-perfection-production-ae48.up.railway.app';
      const response = await fetch(`${base}/api/v1/reorder-tools`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: newOrder.map((item, index) => ({
            id: item.id,
            order: index
          }))
        })
      });
      
      const result = await response.json();
      if (result.success) {
        setTools(newOrder);
        setMessage(`✅ ${result.message}`);
      } else {
        setMessage(`❌ Error reordering tools: ${result.error}`);
      }
    } catch (error) {
      setMessage(`❌ Error reordering tools: ${error.message}`);
    }
  }

  async function reorderProjects(newOrder) {
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || 'https://kind-perfection-production-ae48.up.railway.app';
      const response = await fetch(`${base}/api/v1/reorder-projects`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: newOrder.map((item, index) => ({
            id: item.id,
            order: index
          }))
        })
      });
      
      const result = await response.json();
      if (result.success) {
        setProjects(newOrder);
        setMessage(`✅ ${result.message}`);
      } else {
        setMessage(`❌ Error reordering projects: ${result.error}`);
      }
    } catch (error) {
      setMessage(`❌ Error reordering projects: ${error.message}`);
    }
  }

  async function reorderBlogs(newOrder) {
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || 'https://kind-perfection-production-ae48.up.railway.app';
      const response = await fetch(`${base}/api/v1/reorder-blogs`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: newOrder.map((item, index) => ({
            id: item.id,
            order: index
          }))
        })
      });
      
      const result = await response.json();
      if (result.success) {
        setBlogs(newOrder);
        setMessage(`✅ ${result.message}`);
      } else {
        setMessage(`❌ Error reordering blogs: ${result.error}`);
      }
    } catch (error) {
      setMessage(`❌ Error reordering blogs: ${error.message}`);
    }
  }

  async function addTool() {
    setBusy(true);
    setMessage("Adding tool...");
    const base = process.env.NEXT_PUBLIC_API_URL;
    try {
      const response = await fetch(`${base}/api/v1/add-tool-public`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify(toolForm)
      });
      const result = await response.json();
      if (result.success) {
        setMessage("Tool added successfully!");
        setToolForm({
          name: "",
          description: "",
          url: "",
          category: "AI Chat & Assistant",
          pricing: "",
          status: "Active",
          image_url: ""
        });
        fetchStats();
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      setMessage(`Error adding tool: ${error.message}`);
    }
    setBusy(false);
  }

  async function addProject() {
    setBusy(true);
    setMessage("Adding project...");
    const base = process.env.NEXT_PUBLIC_API_URL;
    try {
      const response = await fetch(`${base}/api/v1/add-project-public`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify(projectForm)
      });
      const result = await response.json();
      if (result.success) {
        setMessage("Project added successfully!");
        setProjectForm({
          name: "",
          description: "",
          url: "",
          github_url: "",
          category: "Web Development",
          technologies: "",
          image_url: ""
        });
        fetchStats();
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      setMessage(`Error adding project: ${error.message}`);
    }
    setBusy(false);
  }

  async function uploadImage(file) {
    setBusy(true);
    setMessage("Uploading image...");
    const base = process.env.NEXT_PUBLIC_API_URL;
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`${base}/api/v1/upload-image-public`, {
        method: "POST",
        credentials: 'include',
        body: formData
      });
      
      const result = await response.json();
      if (result.success) {
        setProjectForm({...projectForm, image_url: result.data.image_url});
        setMessage("Image uploaded successfully!");
      } else {
        setMessage(`Error uploading image: ${result.error}`);
      }
    } catch (error) {
      setMessage(`Error uploading image: ${error.message}`);
    }
    setBusy(false);
  }

  function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
      uploadImage(file);
    }
  }

  async function generateBlog() {
    setBusy(true);
    setMessage("Generating blog...");
    const base = process.env.NEXT_PUBLIC_API_URL;
    try {
      const response = await fetch(`${base}/api/v1/generate-blog`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify(blogForm)
      });
      const result = await response.json();
      if (result.success) {
        setGeneratedBlog(result.data);
        setMessage("Blog generated successfully!");
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      setMessage(`Error generating blog: ${error.message}`);
    }
    setBusy(false);
  }

  async function saveBlog() {
    if (!generatedBlog) return;
    setBusy(true);
    setMessage("Saving blog...");
    const base = process.env.NEXT_PUBLIC_API_URL;
    try {
      const response = await fetch(`${base}/api/v1/save-generated-blog`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify(generatedBlog)
      });
      const result = await response.json();
      if (result.success) {
        setMessage("Blog saved successfully!");
        setGeneratedBlog(null);
        setBlogForm({
          topic: "",
          category: "Technology",
          tone: "professional",
          length: "medium"
        });
        fetchStats();
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      setMessage(`Error saving blog: ${error.message}`);
    }
    setBusy(false);
  }

  async function deleteTool(toolId) {
    if (!confirm("Are you sure you want to delete this tool?")) return;
    setBusy(true);
    setMessage("Deleting tool...");
    const base = process.env.NEXT_PUBLIC_API_URL;
    try {
      const response = await fetch(`${base}/api/v1/delete-tool-public/${toolId}`, {
        method: "DELETE",
        headers: { 'Origin': window.location.origin }
      });
      const result = await response.json();
      if (result.success) {
        setMessage("Tool deleted successfully!");
        fetchStats();
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      setMessage(`Error deleting tool: ${error.message}`);
    }
    setBusy(false);
  }

  async function deleteProject(projectId) {
    if (!confirm("Are you sure you want to delete this project?")) return;
    setBusy(true);
    setMessage("Deleting project...");
    const base = process.env.NEXT_PUBLIC_API_URL;
    try {
      const response = await fetch(`${base}/api/v1/delete-project-public/${projectId}`, {
        method: "DELETE",
        headers: { 'Origin': window.location.origin }
      });
      const result = await response.json();
      if (result.success) {
        setMessage("Project deleted successfully!");
        fetchStats();
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      setMessage(`Error deleting project: ${error.message}`);
    }
    setBusy(false);
  }

  async function deleteBlog(blogId) {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    setBusy(true);
    setMessage("Deleting blog...");
    const base = process.env.NEXT_PUBLIC_API_URL;
    try {
      const response = await fetch(`${base}/api/v1/delete-blog-public/${blogId}`, {
        method: "DELETE",
        headers: { 'Origin': window.location.origin }
      });
      const result = await response.json();
      if (result.success) {
        setMessage("Blog deleted successfully!");
        fetchStats();
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      setMessage(`Error deleting blog: ${error.message}`);
    }
    setBusy(false);
  }

  // Edit functions
  function startEditProject(project) {
    setEditingProject(project);
    setProjectForm({
      name: project.name,
      description: project.description,
      url: project.url || "",
      github_url: project.github_url || "",
      category: project.category || "Web Development",
      technologies: project.technologies || "",
      image_url: project.image_url || ""
    });
    setActiveTab("projects");
  }

  function startEditTool(tool) {
    setEditingTool(tool);
    setToolForm({
      name: tool.name,
      description: tool.description,
      url: tool.url,
      category: tool.category || "Chat Assistant",
      pricing: tool.pricing || "",
      status: tool.status || "Active"
    });
    setActiveTab("tools");
  }

  function cancelEdit() {
    setEditingProject(null);
    setEditingTool(null);
    setProjectForm({
      name: "",
      description: "",
      url: "",
      github_url: "",
      category: "Web Development",
      technologies: "",
      image_url: ""
    });
    setToolForm({
      name: "",
      description: "",
      url: "",
      category: "AI Chat & Assistant",
      pricing: "",
      status: "Active"
    });
  }

  async function updateProject() {
    if (!editingProject) return;
    setBusy(true);
    setMessage("Updating project...");
    const base = process.env.NEXT_PUBLIC_API_URL;
    try {
      const response = await fetch(`${base}/api/v1/update-project-public/${editingProject.id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify(projectForm)
      });
      const result = await response.json();
      if (result.success) {
        setMessage("Project updated successfully!");
        fetchStats();
        cancelEdit();
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      setMessage(`Error updating project: ${error.message}`);
    }
    setBusy(false);
  }

  async function updateToolCategories() {
    setBusy(true);
    setMessage("Updating tool categories...");
    const base = process.env.NEXT_PUBLIC_API_URL;
    try {
      const response = await fetch(`${base}/api/v1/update-tool-categories`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        }
      });
      const result = await response.json();
      if (result.success) {
        setMessage(`✅ ${result.message}`);
        fetchStats();
      } else {
        setMessage(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      setMessage(`❌ Error updating categories: ${error.message}`);
    }
    setBusy(false);
  }

  async function updateBlogCategories() {
    setBusy(true);
    setMessage("Updating blog categories...");
    const base = process.env.NEXT_PUBLIC_API_URL;
    try {
      const response = await fetch(`${base}/api/v1/update-blog-categories`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        }
      });
      const result = await response.json();
      if (result.success) {
        setMessage(`✅ ${result.message}`);
        fetchStats();
      } else {
        setMessage(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      setMessage(`❌ Error updating blog categories: ${error.message}`);
    }
    setBusy(false);
  }

  async function updateTool() {
    if (!editingTool) return;
    setBusy(true);
    setMessage("Updating tool...");
    const base = process.env.NEXT_PUBLIC_API_URL;
    try {
      const response = await fetch(`${base}/api/v1/update-tool-public/${editingTool.id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify(toolForm)
      });
      const result = await response.json();
      if (result.success) {
        setMessage("Tool updated successfully!");
        fetchStats();
        cancelEdit();
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      setMessage(`Error updating tool: ${error.message}`);
    }
    setBusy(false);
  }

  useEffect(() => {
    fetchStats();
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
            className="text-center mb-8 md:mb-12"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-brand-500/20 to-brand-600/20 rounded-2xl flex items-center justify-center ring-1 ring-brand-500/30">
                <svg className="w-8 h-8 text-brand-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-white to-brand-300 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-lg text-slate-400">Manual Management</p>
              </div>
            </div>
            <p className="text-xl text-slate-300 mb-6 text-center max-w-3xl mx-auto leading-relaxed">
              Manage your portfolio content with professional tools, drag-and-drop ordering, and intuitive interface
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={fetchStats}
                disabled={busy}
                className="btn flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {busy ? 'Loading...' : 'Refresh Data'}
              </button>
              <button
                onClick={() => window.location.href = '/admin'}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium transition-all duration-300 ring-1 ring-white/20"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Auto Refresh
              </button>
            </div>
          </motion.div>

          {/* Stats Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12"
          >
            <div className="card p-4 md:p-6 text-center group hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-brand-500/30 to-brand-600/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ring-1 ring-brand-500/30">
                <svg className="w-6 h-6 text-brand-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-white mb-2 group-hover:text-brand-300 transition-colors duration-300">{stats.tools || 0}</h3>
              <p className="text-slate-300 mb-2">AI Tools</p>
              <button 
                onClick={() => setActiveTab("list-tools")}
                className="text-xs text-brand-400 hover:text-brand-300 transition-colors duration-200"
              >
                View & Reorder →
              </button>
            </div>
            
            <div className="card p-4 md:p-6 text-center group hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-emerald-500/30 to-emerald-600/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ring-1 ring-emerald-500/30">
                <svg className="w-6 h-6 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors duration-300">{stats.projects || 0}</h3>
              <p className="text-slate-300 mb-2">Projects</p>
              <button 
                onClick={() => setActiveTab("list-projects")}
                className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors duration-200"
              >
                View & Reorder →
              </button>
            </div>
            
            <div className="card p-4 md:p-6 text-center group hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-blue-500/30 to-blue-600/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ring-1 ring-blue-500/30">
                <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors duration-300">{stats.blogs || 0}</h3>
              <p className="text-slate-300 mb-2">Blog Posts</p>
              <button 
                onClick={() => setActiveTab("list-blogs")}
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors duration-200"
              >
                View & Reorder →
              </button>
            </div>
          </motion.div>

          {/* Navigation Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-2 md:gap-3 mb-6 md:mb-8 border-b border-white/10 pb-2"
          >
            {["tools", "projects", "blogs", "list-tools", "list-projects", "list-blogs"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 md:px-6 py-2 md:py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                  activeTab === tab 
                    ? 'bg-brand-500 text-ink shadow-lg shadow-brand-500/25' 
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white ring-1 ring-white/10'
                }`}
              >
                {tab === "tools" && (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Tools
                  </>
                )}
                {tab === "projects" && (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Projects
                  </>
                )}
                {tab === "blogs" && (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Generate Blogs
                  </>
                )}
                {tab === "list-tools" && (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    List Tools
                  </>
                )}
                {tab === "list-projects" && (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    List Projects
                  </>
                )}
                {tab === "list-blogs" && (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    List Blogs
                  </>
                )}
              </button>
            ))}
          </motion.div>

          {/* Status Message */}
          {message && (
            <div className="card p-4 mb-8 bg-gradient-to-r from-brand-500/10 to-emerald-500/10 border-brand-500/20">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-brand-400 rounded-full animate-pulse"></div>
                <p className="text-white font-medium">{message}</p>
              </div>
            </div>
          )}

          {/* Drag and Drop Instructions */}
          {(activeTab === "list-tools" || activeTab === "list-projects" || activeTab === "list-blogs") && (
            <div className="card p-6 mb-8 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">🎯 Drag & Drop Reordering</h3>
                  <p className="text-slate-300 mb-3">
                    Drag items by the <span className="text-purple-300 font-mono">⋮⋮</span> handle to reorder them. 
                    The new order will be saved automatically and displayed on your public pages.
                  </p>
                  <div className="flex flex-wrap gap-2 text-sm">
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full">✨ Real-time updates</span>
                    <span className="px-3 py-1 bg-pink-500/20 text-pink-300 rounded-full">🎨 Visual feedback</span>
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full">💾 Auto-save</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tools Tab */}
          {activeTab === "tools" && (
            <div className="card p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-white">
                  {editingTool ? "✏️ Edit AI Tool" : "🛠️ Add AI Tool"}
                </h2>
                {editingTool && (
                  <button
                    onClick={cancelEdit}
                    className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-xl transition-colors duration-200"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
          <div className="grid gap-4">
            <div>
              <label className="text-white block mb-2">Tool Name *</label>
              <input
                type="text"
                value={toolForm.name}
                onChange={(e) => setToolForm({...toolForm, name: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '6px',
                  border: '1px solid #444',
                  background: '#333',
                  color: '#fff'
                }}
                placeholder="e.g., ChatGPT, Midjourney"
              />
            </div>
            <div>
              <label style={{color: '#fff', display: 'block', marginBottom: 8}}>Description *</label>
              <textarea
                value={toolForm.description}
                onChange={(e) => setToolForm({...toolForm, description: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '6px',
                  border: '1px solid #444',
                  background: '#333',
                  color: '#fff',
                  minHeight: '80px'
                }}
                placeholder="Describe what this tool does..."
              />
            </div>
            <div>
              <label style={{color: '#fff', display: 'block', marginBottom: 8}}>URL *</label>
              <input
                type="url"
                value={toolForm.url}
                onChange={(e) => setToolForm({...toolForm, url: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '6px',
                  border: '1px solid #444',
                  background: '#333',
                  color: '#fff'
                }}
                placeholder="https://example.com"
              />
            </div>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16}}>
              <div>
                <label style={{color: '#fff', display: 'block', marginBottom: 8}}>Category</label>
                <select
                  value={toolForm.category}
                  onChange={(e) => setToolForm({...toolForm, category: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '6px',
                    border: '1px solid #444',
                    background: '#333',
                    color: '#fff'
                  }}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{color: '#fff', display: 'block', marginBottom: 8}}>Pricing</label>
                <input
                  type="text"
                  value={toolForm.pricing}
                  onChange={(e) => setToolForm({...toolForm, pricing: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '6px',
                    border: '1px solid #444',
                    background: '#333',
                    color: '#fff'
                  }}
                  placeholder="Free, $10/month, etc."
                />
              </div>
            </div>
            
            {/* Image Upload Section */}
            <div>
              <label className="text-white block mb-2">Tool Thumbnail Image</label>
              <div className="flex gap-3 items-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setBusy(true);
                      setMessage("Uploading image...");
                      try {
                        const formData = new FormData();
                        formData.append('file', file);
                        
                        const base = process.env.NEXT_PUBLIC_API_URL;
                        const response = await fetch(`${base}/api/v1/upload-image-public`, {
                          method: 'POST',
                          body: formData
                        });
                        
                        const result = await response.json();
                        if (result.success) {
                          setToolForm({...toolForm, image_url: result.data.image_url});
                          setMessage("Image uploaded successfully!");
                        } else {
                          setMessage(`Error uploading image: ${result.error}`);
                        }
                      } catch (error) {
                        setMessage(`Error uploading image: ${error.message}`);
                      }
                      setBusy(false);
                    }
                  }}
                  className="flex-1 p-2 rounded-md border border-slate-600 bg-slate-800 text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                />
                {toolForm.image_url && (
                  <div className="flex items-center gap-2">
                    <img 
                      src={`${process.env.NEXT_PUBLIC_API_URL}${toolForm.image_url}`} 
                      alt="Tool thumbnail" 
                      className="w-10 h-10 rounded object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setToolForm({...toolForm, image_url: ""})}
                      className="bg-red-600 hover:bg-red-700 text-white border-none px-2 py-1 rounded text-xs cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <button
              onClick={editingTool ? updateTool : addTool}
              disabled={busy || !toolForm.name || !toolForm.description || !toolForm.url}
              style={{
                background: editingTool ? '#007bff' : '#28a745',
                color: '#fff',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '6px',
                cursor: busy ? 'not-allowed' : 'pointer',
                opacity: busy ? 0.6 : 1
              }}
            >
              {busy ? (editingTool ? "Updating..." : "Adding...") : (editingTool ? "Update Tool" : "Add Tool")}
            </button>
          </div>
        </div>
      )}

      {/* Projects Tab */}
      {activeTab === "projects" && (
        <div style={{background: '#2a2a2a', padding: 24, borderRadius: 12}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
            <h2 style={{color: '#fff', margin: 0}}>
              {editingProject ? "✏️ Edit Project" : "📁 Add Project"}
            </h2>
            {editingProject && (
              <button
                onClick={cancelEdit}
                style={{
                  background: '#6c757d',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel Edit
              </button>
            )}
          </div>
          <div style={{display: 'grid', gap: 16}}>
            <div>
              <label style={{color: '#fff', display: 'block', marginBottom: 8}}>Project Name *</label>
              <input
                type="text"
                value={projectForm.name}
                onChange={(e) => setProjectForm({...projectForm, name: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '6px',
                  border: '1px solid #444',
                  background: '#333',
                  color: '#fff'
                }}
                placeholder="e.g., AI Portfolio Website"
              />
            </div>
            <div>
              <label style={{color: '#fff', display: 'block', marginBottom: 8}}>Description *</label>
              <textarea
                value={projectForm.description}
                onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '6px',
                  border: '1px solid #444',
                  background: '#333',
                  color: '#fff',
                  minHeight: '80px'
                }}
                placeholder="Describe your project..."
              />
            </div>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16}}>
              <div>
                <label style={{color: '#fff', display: 'block', marginBottom: 8}}>Live URL</label>
                <input
                  type="url"
                  value={projectForm.url}
                  onChange={(e) => setProjectForm({...projectForm, url: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '6px',
                    border: '1px solid #444',
                    background: '#333',
                    color: '#fff'
                  }}
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <label style={{color: '#fff', display: 'block', marginBottom: 8}}>GitHub URL</label>
                <input
                  type="url"
                  value={projectForm.github_url}
                  onChange={(e) => setProjectForm({...projectForm, github_url: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '6px',
                    border: '1px solid #444',
                    background: '#333',
                    color: '#fff'
                  }}
                  placeholder="https://github.com/username/repo"
                />
              </div>
            </div>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16}}>
              <div>
                <label style={{color: '#fff', display: 'block', marginBottom: 8}}>Category</label>
                <select
                  value={projectForm.category}
                  onChange={(e) => setProjectForm({...projectForm, category: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '6px',
                    border: '1px solid #444',
                    background: '#333',
                    color: '#fff'
                  }}
                >
                  {projectCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{color: '#fff', display: 'block', marginBottom: 8}}>Technologies</label>
                <input
                  type="text"
                  value={projectForm.technologies}
                  onChange={(e) => setProjectForm({...projectForm, technologies: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '6px',
                    border: '1px solid #444',
                    background: '#333',
                    color: '#fff'
                  }}
                  placeholder="React, Python, AI, etc."
                />
              </div>
            </div>
            <div>
              <label style={{color: '#fff', display: 'block', marginBottom: 8}}>Project Preview Image</label>
              <div style={{display: 'flex', gap: 12, alignItems: 'center'}}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={busy}
                  style={{
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px solid #444',
                    background: '#333',
                    color: '#fff',
                    cursor: busy ? 'not-allowed' : 'pointer'
                  }}
                />
                {projectForm.image_url && (
                  <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                    <img 
                      src={`${process.env.NEXT_PUBLIC_API_URL}${projectForm.image_url}`} 
                      alt="Preview" 
                      style={{
                        width: '60px', 
                        height: '40px', 
                        objectFit: 'cover', 
                        borderRadius: '4px',
                        border: '1px solid #444'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setProjectForm({...projectForm, image_url: ""})}
                      style={{
                        background: '#dc3545',
                        color: '#fff',
                        border: 'none',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
              <p style={{color: '#ccc', fontSize: '12px', margin: '4px 0 0 0'}}>
                Upload a preview image for your project (max 5MB, JPG/PNG/GIF)
              </p>
            </div>
            <button
              onClick={editingProject ? updateProject : addProject}
              disabled={busy || !projectForm.name || !projectForm.description}
              style={{
                background: editingProject ? '#007bff' : '#28a745',
                color: '#fff',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '6px',
                cursor: busy ? 'not-allowed' : 'pointer',
                opacity: busy ? 0.6 : 1
              }}
            >
              {busy ? (editingProject ? "Updating..." : "Adding...") : (editingProject ? "Update Project" : "Add Project")}
            </button>
          </div>
        </div>
      )}

      {/* Blogs Tab */}
      {activeTab === "blogs" && (
        <div style={{background: '#2a2a2a', padding: 24, borderRadius: 12}}>
          <h2 style={{color: '#fff', margin: 0, marginBottom: 16}}>📝 Generate Blog Post</h2>
          
          {!generatedBlog ? (
            <div style={{display: 'grid', gap: 16}}>
              <div>
                <label style={{color: '#fff', display: 'block', marginBottom: 8}}>Blog Topic *</label>
                <input
                  type="text"
                  value={blogForm.topic}
                  onChange={(e) => setBlogForm({...blogForm, topic: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '6px',
                    border: '1px solid #444',
                    background: '#333',
                    color: '#fff'
                  }}
                  placeholder="e.g., The Future of AI in Web Development"
                />
              </div>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16}}>
                <div>
                  <label style={{color: '#fff', display: 'block', marginBottom: 8}}>Category</label>
                  <select
                    value={blogForm.category}
                    onChange={(e) => setBlogForm({...blogForm, category: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '6px',
                      border: '1px solid #444',
                      background: '#333',
                      color: '#fff'
                    }}
                  >
                    {blogCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{color: '#fff', display: 'block', marginBottom: 8}}>Tone</label>
                  <select
                    value={blogForm.tone}
                    onChange={(e) => setBlogForm({...blogForm, tone: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '6px',
                      border: '1px solid #444',
                      background: '#333',
                      color: '#fff'
                    }}
                  >
                    <option value="professional">Professional</option>
                    <option value="casual">Casual</option>
                    <option value="technical">Technical</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{color: '#fff', display: 'block', marginBottom: 8}}>Length</label>
                <select
                  value={blogForm.length}
                  onChange={(e) => setBlogForm({...blogForm, length: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '6px',
                    border: '1px solid #444',
                    background: '#333',
                    color: '#fff'
                  }}
                >
                  <option value="short">Short (1-2 paragraphs)</option>
                  <option value="medium">Medium (2-3 paragraphs)</option>
                  <option value="long">Long (3+ paragraphs)</option>
                </select>
              </div>
              <button
                onClick={generateBlog}
                disabled={busy || !blogForm.topic}
                style={{
                  background: '#007bff',
                  color: '#fff',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  cursor: busy ? 'not-allowed' : 'pointer',
                  opacity: busy ? 0.6 : 1
                }}
              >
                {busy ? "Generating..." : "Generate Blog Post"}
              </button>
            </div>
          ) : (
            <div style={{display: 'grid', gap: 16}}>
              <div style={{background: '#333', padding: 16, borderRadius: 8}}>
                <h3 style={{color: '#fff', margin: 0, marginBottom: 8}}>{generatedBlog.title}</h3>
                <p style={{color: '#ccc', margin: 0, marginBottom: 16}}>{generatedBlog.excerpt}</p>
                <div style={{
                  background: '#444', 
                  padding: 16, 
                  borderRadius: 6,
                  maxHeight: '300px',
                  overflow: 'auto',
                  whiteSpace: 'pre-wrap',
                  color: '#fff',
                  fontSize: '14px'
                }}>
                  {generatedBlog.content}
                </div>
              </div>
              <div style={{display: 'flex', gap: 12}}>
                <button
                  onClick={saveBlog}
                  disabled={busy}
                  style={{
                    background: '#28a745',
                    color: '#fff',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '6px',
                    cursor: busy ? 'not-allowed' : 'pointer',
                    opacity: busy ? 0.6 : 1
                  }}
                >
                  {busy ? "Saving..." : "Save Blog Post"}
                </button>
                <button
                  onClick={() => setGeneratedBlog(null)}
                  style={{
                    background: '#6c757d',
                    color: '#fff',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Generate New
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* List Tools Tab */}
      {activeTab === "list-tools" && (
        <div className="card p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-white">📋 AI Tools List</h2>
            <button
              onClick={updateToolCategories}
              disabled={busy}
              className="px-6 py-3 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-500/25"
            >
              {busy ? 'Updating...' : '🔄 Update Categories'}
            </button>
          </div>
          <div className="space-y-4">
            <DragDropList
              items={tools}
              onReorder={reorderTools}
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
              renderItem={(tool) => (
                <div className="card p-6 hover:scale-[1.02] transition-all duration-300 border border-white/10 hover:border-brand-500/30">
                  <div className="flex items-center gap-4">
                    <DragHandle />
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold text-white mb-2">{tool.name}</h4>
                      <p className="text-slate-300 mb-4 leading-relaxed">{tool.description}</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-brand-500/20 text-brand-300 rounded-full text-sm font-medium">
                          {tool.category}
                        </span>
                        {tool.pricing && (
                          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-sm font-medium">
                            {tool.pricing}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <a 
                        href={tool.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors duration-200 shadow-lg shadow-emerald-500/25"
                      >
                        Visit
                      </a>
                      <button
                        onClick={() => startEditTool(tool)}
                        disabled={busy}
                        className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTool(tool.id)}
                        disabled={busy}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            />
          </div>
        </div>
      )}

      {/* List Projects Tab */}
      {activeTab === "list-projects" && (
        <div className="card p-8">
          <h2 className="text-2xl font-bold text-white mb-8">📋 Projects List</h2>
          <div className="space-y-4">
            <DragDropList
              items={projects}
              onReorder={reorderProjects}
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
              renderItem={(project) => (
                <div className="card p-6 hover:scale-[1.02] transition-all duration-300 border border-white/10 hover:border-emerald-500/30">
                  <div className="flex items-center gap-4">
                    <DragHandle />
                    <div className="flex-1 flex gap-4">
                      {project.image_url && (
                        <img 
                          src={`${process.env.NEXT_PUBLIC_API_URL}${project.image_url}`} 
                          alt={project.name} 
                          className="w-20 h-16 object-cover rounded-lg border border-white/10 flex-shrink-0"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="text-xl font-semibold text-white mb-2">{project.name}</h4>
                        <p className="text-slate-300 mb-4 leading-relaxed">{project.description}</p>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-sm font-medium">
                            {project.category}
                          </span>
                          {project.technologies && (
                            <span className="px-3 py-1 bg-slate-500/20 text-slate-300 rounded-full text-sm font-medium">
                              {project.technologies}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      {project.url && (
                        <a 
                          href={project.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors duration-200 shadow-lg shadow-emerald-500/25"
                        >
                          Live
                        </a>
                      )}
                      {project.github_url && (
                        <a 
                          href={project.github_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-slate-500 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors duration-200"
                        >
                          GitHub
                        </a>
                      )}
                      <button
                        onClick={() => startEditProject(project)}
                        disabled={busy}
                        className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteProject(project.id)}
                        disabled={busy}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            />
          </div>
        </div>
      )}

      {/* List Blogs Tab */}
      {activeTab === "list-blogs" && (
        <div className="card p-8">
          <h2 className="text-2xl font-bold text-white mb-8">📋 Blogs List</h2>
          <div className="space-y-4">
            <DragDropList
              items={blogs}
              onReorder={reorderBlogs}
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
              renderItem={(blog) => (
                <div className="card p-6 hover:scale-[1.02] transition-all duration-300 border border-white/10 hover:border-blue-500/30">
                  <div className="flex items-center gap-4">
                    <DragHandle />
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold text-white mb-2">{blog.title}</h4>
                      <p className="text-slate-300 mb-4 leading-relaxed">{blog.excerpt}</p>
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium">
                        {blog.category}
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => deleteBlog(blog.id)}
                        disabled={busy}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            />
          </div>
        </div>
      </div>
      )}
    </>
  );
}

import { useEffect, useState } from "react";
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
    "Chat Assistant", "Image Generation", "Video Editing", "Voice", 
    "Presentation", "Coding & Development", "Productivity", "Writing",
    "Art & Design", "Marketing", "Research", "Other"
  ];
  async function refreshBlogs() {
    setBusy(true);
    setMessage("Refreshing blogs and resetting timer...");
    const base = process.env.NEXT_PUBLIC_API_URL;
    
    const result = await safeFetch(`${base}/api/v1/refresh-blogs`, { 
      method: "POST", 
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    }, 30000); // 30 second timeout for blog refresh
    
    if (result.success) {
      setMessage(`✅ ${result.data.message} - ${result.data.data?.added || 0} new blogs added`);
      await fetchAll();
    } else {
      setMessage(`❌ Error: ${result.error}`);
    }
    setBusy(false);
  }

  async function fetchAll() {
    const base = process.env.NEXT_PUBLIC_API_URL;
    
    const requests = [
      { url: `${base}/api/v1/tools/status`, options: { credentials: 'include' } },
      { url: `${base}/api/v1/dashboard`, options: { credentials: 'include' } },
      { url: `${base}/api/v1/scheduler-status`, options: { credentials: 'include' } }
    ];
    
    const results = await fetchMultiple(requests);
    const [t, d, s] = results;
    
    if (t.success) {
      setTools(t.data?.data?.recent_tools || []);
    }
    if (d.success) {
      setBlogs(d.data?.data?.recent_blogs || []);
      setStats(d.data?.data?.overview || {});
    }
    if (s.success) {
      setSchedulerStatus(s.data?.data || {});
    }
    
    // Show error if any request failed
    const errors = results.filter(r => !r.success).map(r => r.error);
    if (errors.length > 0) {
      setMessage(`Error fetching data: ${errors.join(', ')}`);
    }
  }



  useEffect(() => { 
    fetchAll();
  }, []);

  return (
    <>
      {/* <SessionTimeout /> */}
      <BrowserCloseHandler />
      <div style={{padding: 24, maxWidth: 1200, margin: '0 auto'}}>
      <div style={{background: '#1a1a1a', padding: 24, borderRadius: 12, marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div>
          <h1 style={{color: '#fff', margin: 0, marginBottom: 16}}>🤖 AI Portfolio Admin Dashboard</h1>
          <p style={{color: '#ccc', margin: 0}}>Manage AI tools, blogs, and content across all categories</p>
        </div>
        <button
          onClick={() => window.location.href = '/admin/logout'}
          style={{
            background: '#dc3545',
            color: '#fff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          🚪 Logout
        </button>
      </div>

      {/* Stats Overview */}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24}}>
        <div style={{background: '#2a2a2a', padding: 16, borderRadius: 8, textAlign: 'center'}}>
          <h3 style={{color: '#fff', margin: 0}}>{stats.total_tools || 0}</h3>
          <p style={{color: '#ccc', margin: 0}}>Total Tools</p>
        </div>
        <div style={{background: '#2a2a2a', padding: 16, borderRadius: 8, textAlign: 'center'}}>
          <h3 style={{color: '#fff', margin: 0}}>{stats.total_blogs || 0}</h3>
          <p style={{color: '#ccc', margin: 0}}>Total Blogs</p>
        </div>
        <div style={{background: '#2a2a2a', padding: 16, borderRadius: 8, textAlign: 'center'}}>
          <h3 style={{color: '#fff', margin: 0}}>{stats.total_projects || 0}</h3>
          <p style={{color: '#ccc', margin: 0}}>Total Projects</p>
        </div>
      </div>

      {/* Blog Update Status */}
      <div style={{background: '#1a1a1a', padding: 20, borderRadius: 12, marginBottom: 24, border: '1px solid #333'}}>
        <h3 style={{color: '#fff', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: 8}}>
          📅 Blog Update Status
        </h3>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16}}>
          <div style={{background: '#2a2a2a', padding: 16, borderRadius: 8}}>
            <h4 style={{color: '#06B6D4', margin: '0 0 8px 0'}}>Schedule</h4>
            <p style={{color: '#ccc', margin: 0}}>{schedulerStatus.blog_schedule || 'Every 3 days'}</p>
          </div>
          <div style={{background: '#2a2a2a', padding: 16, borderRadius: 8}}>
            <h4 style={{color: '#10B981', margin: '0 0 8px 0'}}>Status</h4>
            <p style={{color: '#ccc', margin: 0}}>
              {schedulerStatus.status === 'running' ? '🟢 Active' : '🔴 Inactive'}
            </p>
          </div>
          <div style={{background: '#2a2a2a', padding: 16, borderRadius: 8}}>
            <h4 style={{color: '#F59E0B', margin: '0 0 8px 0'}}>Next Update</h4>
            <p style={{color: '#ccc', margin: 0}}>
              {schedulerStatus.jobs?.find(job => job.id === 'blogs')?.next_run_time ? 
                new Date(schedulerStatus.jobs.find(job => job.id === 'blogs').next_run_time).toLocaleString() : 
                'Calculating...'}
            </p>
          </div>
          <div style={{background: '#2a2a2a', padding: 16, borderRadius: 8}}>
            <h4 style={{color: '#8B5CF6', margin: '0 0 8px 0'}}>Timer Status</h4>
            <p style={{color: '#ccc', margin: 0}}>
              {schedulerStatus.jobs?.find(job => job.id === 'blogs')?.next_run_time ? 
                '⏰ Active - Resets on manual refresh' : 
                '⏸️ Inactive'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{display: 'flex', gap: 8, marginBottom: 24, borderBottom: '1px solid #444'}}>
        <button
          onClick={() => {
            window.location.href = `/admin`;
          }}
          style={{
            background: '#007bff',
            color: '#fff',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '6px 6px 0 0',
            cursor: 'pointer',
            borderBottom: '2px solid #007bff'
          }}
        >
          🔄 Auto Refresh
        </button>
        <button
          onClick={() => {
            window.location.href = `/admin/manual`;
          }}
          style={{
            background: 'transparent',
            color: '#fff',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '6px 6px 0 0',
            cursor: 'pointer'
          }}
        >
          🛠️ Manual Management
        </button>
      </div>

      {/* Action Buttons */}
      <div style={{display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap'}}>
        <button 
          onClick={refreshBlogs} 
          disabled={busy}
          style={{
            background: '#28a745', 
            color: '#fff', 
            border: 'none', 
            padding: '12px 24px', 
            borderRadius: 6, 
            cursor: busy ? 'not-allowed' : 'pointer',
            opacity: busy ? 0.6 : 1
          }}
        >
          {busy ? "🔄 Refreshing..." : "📝 Refresh Blogs"}
        </button>
      </div>

      {/* Info Message */}
      <div style={{
        background: '#2a2a2a', 
        padding: 16, 
        borderRadius: 8, 
        marginBottom: 24,
        border: '1px solid #444'
      }}>
        <h3 style={{color: '#fff', margin: 0, marginBottom: 8}}>📊 Content Overview</h3>
                   <p style={{color: '#ccc', margin: 0}}>
             ✅ <strong>Automatic Blog Updates:</strong> Blogs are automatically fetched every 4 hours from RSS sources<br/>
             ✅ <strong>Manual Tool Management:</strong> Tools are added/removed manually for quality control<br/>
             ✅ <strong>AI/ML Focused Categories:</strong> Deep Learning, NLP, Computer Vision, Generative AI, MLOps, Healthcare AI, Finance AI, Marketing AI, AI Startups, etc.<br/>
             ✅ <strong>Smart Limits:</strong> Maximum 10 blogs per category, auto-removes oldest when adding new ones
           </p>
      </div>

      {/* Status Message */}
      {message && (
        <div style={{
          background: '#2a2a2a', 
          padding: 12, 
          borderRadius: 6, 
          marginBottom: 24,
          border: '1px solid #444'
        }}>
          <p style={{color: '#fff', margin: 0}}>{message}</p>
        </div>
      )}

      {/* Tools Section */}
      <div style={{background: '#2a2a2a', padding: 24, borderRadius: 12, marginBottom: 24}}>
        <h2 style={{color: '#fff', margin: 0, marginBottom: 16}}>🛠️ Recent AI Tools</h2>
        <div style={{display: 'grid', gap: 12}}>
          {tools.map(t => (
            <div key={t.id} style={{
              background: '#333', 
              padding: 16, 
              borderRadius: 8,
              border: '1px solid #444'
            }}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div>
                  <h4 style={{color: '#fff', margin: 0, marginBottom: 4}}>{t.name}</h4>
                  <span style={{
                    background: '#007bff', 
                    color: '#fff', 
                    padding: '4px 8px', 
                    borderRadius: 4, 
                    fontSize: '12px'
                  }}>
                    {t.category}
                  </span>
                </div>
                <a 
                  href={t.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    background: '#28a745', 
                    color: '#fff', 
                    padding: '8px 16px', 
                    borderRadius: 4, 
                    textDecoration: 'none',
                    fontSize: '14px'
                  }}
                >
                  Visit →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Blogs Section */}
      <div style={{background: '#2a2a2a', padding: 24, borderRadius: 12}}>
        <h2 style={{color: '#fff', margin: 0, marginBottom: 16}}>📝 Recent Blogs</h2>
        <div style={{display: 'grid', gap: 12}}>
          {blogs.map(b => (
            <div key={b.id} style={{
              background: '#333', 
              padding: 16, 
              borderRadius: 8,
              border: '1px solid #444'
            }}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div>
                  <h4 style={{color: '#fff', margin: 0, marginBottom: 4}}>{b.title}</h4>
                  <span style={{
                    background: '#28a745', 
                    color: '#fff', 
                    padding: '4px 8px', 
                    borderRadius: 4, 
                    fontSize: '12px'
                  }}>
                    {b.category}
                  </span>
                </div>
                {b.url && (
                  <a 
                    href={b.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      background: '#007bff', 
                      color: '#fff', 
                      padding: '8px 16px', 
                      borderRadius: 4, 
                      textDecoration: 'none',
                      fontSize: '14px'
                    }}
                  >
                    Read →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
}

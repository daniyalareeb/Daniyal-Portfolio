import Section from './Section'
import useSWR from 'swr'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const fetcher = async (u) => {
  try {
    const response = await fetch(u);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Tools fetch error:', error);
    return { items: [] };
  }
}

export default function ToolsSection(){
  const { data, error, isLoading } = useSWR(`${API}/api/v1/tools/list`, fetcher)
  const items = data?.items || [
    { id:'demo-1', name:'Demo Tool', description:'A neat demo tool to show layout.' },
    { id:'demo-2', name:'VectorDB Pro', description:'Local vector search playground.' },
    { id:'demo-3', name:'PromptForge', description:'Craft and test prompts quickly.' },
  ]
  return (
    <Section id="tools" title="Latest AI Tools" subtitle="Manually curated AI tools for quality and relevance.">
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-4 border-white/20 border-t-brand-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {items.slice(0,6).map(t => (
            <div key={t.id} className="card p-4">
              <div className="font-medium">{t.name}</div>
              <div className="text-sm text-slate-300 mt-1">{t.description || t.url || '—'}</div>
            </div>
          ))}
        </div>
      )}
    </Section>
  )
}

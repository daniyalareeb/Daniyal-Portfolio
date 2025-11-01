import Section from './Section'
import useSWR from 'swr'

const API = process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' ? window.location.origin : '')
const fetcher = async (u) => {
  try {
    const response = await fetch(u);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Blog fetch error:', error);
    return { items: [] };
  }
}

export default function BlogSection(){
  const { data, error, isLoading } = useSWR(`${API}/api/v1/news/list`, fetcher)
  const items = data?.items || []
  const fallback = items.length === 0
    ? [
        { id:'1', title:'How I built my AI portfolio', source:'Blog', published:'—', summary:'Designing an interactive portfolio with a 3D avatar, LLM chatbot, and RAG CV chat.' },
        { id:'2', title:'FastAPI + OpenRouter: a clean starter', source:'Blog', published:'—', summary:'A simple and powerful template for AI‑powered backends.' },
      ]
    : items

  return (
    <Section id="blog" title="Blog / AI News" subtitle="Auto‑generated summaries from a source you choose (backend will power this).">
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-4 border-white/20 border-t-brand-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {fallback.map(p => (
            <article key={p.id} className="card p-5">
              <h3 className="font-semibold">{p.title}</h3>
              <p className="text-sm text-slate-400 mt-1">{p.source} · {p.published}</p>
              <p className="text-slate-300 mt-3">{p.summary}</p>
              <div className="mt-4">
                <a className="link" href="#">Read</a>
              </div>
            </article>
          ))}
        </div>
      )}
    </Section>
  )
}

import Section from './Section'

export default function CVChatSection(){
  return (
    <Section id="cvchat" title="Chat with my CV" subtitle="Upload CV and ask questions (connects to backend RAG).">
      <div className="card p-6">
        <p className="text-slate-300">This will connect to FastAPI endpoints <code>/cv/upload</code> and <code>/cv/query</code>. For now it's a placeholder.</p>
        <div className="mt-4 flex flex-col md:flex-row gap-3">
          <input type="file" disabled className="rounded-xl px-3 py-2 bg-white/5 ring-1 ring-white/10" />
          <input type="text" placeholder="Ask something about my CV…" disabled className="flex-1 rounded-xl px-3 py-2 bg-white/5 ring-1 ring-white/10" />
          <button className="btn opacity-50 cursor-not-allowed">Send</button>
        </div>
        <p className="text-sm text-slate-400 mt-3">(Once backend is ready, enable these inputs and wire fetch calls.)</p>
      </div>
    </Section>
  )
}

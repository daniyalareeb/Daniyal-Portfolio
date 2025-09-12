export default function Section({ id, title, subtitle, children }){
  return (
    <section id={id} className="py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-semibold">{title}</h2>
          {subtitle && <p className="text-slate-300 mt-2">{subtitle}</p>}
        </div>
        {children}
      </div>
    </section>
  )
}

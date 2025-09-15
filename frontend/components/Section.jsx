export default function Section({ id, title, subtitle, children }){
  return (
    <section id={id} className="py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-4 md:mb-6">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold">{title}</h2>
          {subtitle && <p className="text-sm md:text-base text-slate-300 mt-1 md:mt-2">{subtitle}</p>}
        </div>
        {children}
      </div>
    </section>
  )
}

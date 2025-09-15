export default function Footer(){
  return (
    <footer className="py-8 md:py-10">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="card p-4 md:p-6 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm md:text-base text-slate-300">© {new Date().getFullYear()} daniyalareeb. All rights reserved.</p>
          <div className="flex gap-3 md:gap-4 mt-2 md:mt-0">
            <a className="link text-sm md:text-base" href="https://github.com/daniyalareeb">GitHub</a>
            <a className="link text-sm md:text-base" href="https://linkedin.com/in/daniyalareeb">LinkedIn</a>
            <a className="link text-sm md:text-base" href="mailto:daniyalareeb123@gmail.com">Email</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

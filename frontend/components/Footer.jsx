export default function Footer(){
  return (
    <footer className="py-10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="card p-6 flex flex-col md:flex-row items-center justify-between">
          <p className="text-slate-300">© {new Date().getFullYear()} daniyalareeb. All rights reserved.</p>
          <div className="flex gap-4 mt-3 md:mt-0">
            <a className="link" href="https://github.com/daniyalareeb">GitHub</a>
            <a className="link" href="https://linkedin.com/in/daniyalareeb">LinkedIn</a>
            <a className="link" href="mailto:daniyalareeb123@gmail.com">Email</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

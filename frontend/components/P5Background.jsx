import React from 'react'
import dynamic from 'next/dynamic'

const Sketch = dynamic(() => import('react-p5'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-gradient-to-br from-brand-500/10 to-transparent" />
})

export default function P5Background(){
  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef)
    p5.noStroke()
  }

  const draw = (p5) => {
    p5.clear()
    for(let i=0;i<7;i++){
      p5.fill(6,182,212, 10)
      p5.ellipse(
        (p5.noise(i, p5.frameCount*0.003)*p5.width),
        (p5.noise(i*10, p5.frameCount*0.002)*p5.height),
        320, 320
      )
    }
  }

  const windowResized = (p5) => {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight)
  }

  return (
    <div className="pointer-events-none absolute inset-0 -z-10">
      <Sketch
        setup={setup}
        draw={draw}
        windowResized={windowResized}
      />
    </div>
  )
}

/**
 * DanPortfolio Frontend - 3D Avatar Component
 * 
 * This component renders an interactive 3D avatar using Three.js and React Three Fiber.
 * It displays a half-body view of the avatar with proper positioning and lighting.
 * 
 * Key Features:
 * - 3D model loading and rendering
 * - Stable positioning with no unwanted movement
 * - Professional lighting setup with Stage component
 * - Optimized performance with preloading
 * - Responsive design that works on all devices
 * 
 * Technical Details:
 * - Uses GLB format for efficient 3D model loading
 * - Implements stable positioning to prevent drift
 * - Applies professional lighting with shadows
 * - Optimized camera positioning for half-body view
 * 
 * Author: Daniyal Ahmad
 * Repository: https://github.com/daniyalareeb/portfolio
 */

import React, { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stage, useGLTF, Environment } from '@react-three/drei'

/**
 * AvatarModel Component
 * 
 * Renders the 3D avatar model with stable positioning.
 * Uses useFrame hook to maintain consistent positioning and prevent
 * any unwanted movement or rotation of the avatar.
 * 
 * @returns {JSX.Element} The 3D avatar model group
 */
function AvatarModel(){
  // Load the 3D model from GLB file
  const { scene } = useGLTF('/avatar.glb')
  const meshRef = useRef()

  // Animation frame hook to maintain stable positioning
  useFrame(() => {
    if (meshRef.current) {
      // Keep avatar completely stable - no movement at all
      // This prevents any drift or unwanted rotation
      meshRef.current.rotation.y = 0
      meshRef.current.rotation.x = 0
      meshRef.current.rotation.z = 0
      meshRef.current.position.y = -0.2 // Center the head in the frame
    }
  })

  return (
    <group ref={meshRef} position={[0, -0.2, 0]}>
      <primitive
        object={scene}
        scale={1.0} // Adjusted scale for proper framing
        position={[0, 0, 0]}
      />
    </group>
  )
}

// Preload the 3D model for better performance
useGLTF.preload('/avatar.glb')

/**
 * ThreeAvatar Main Component
 * 
 * The main component that renders the 3D avatar with professional lighting
 * and camera setup. Provides a stable, interactive 3D experience optimized
 * for portfolio presentation.
 * 
 * @returns {JSX.Element} The complete 3D avatar container with Canvas
 */
export default function ThreeAvatar(){
  return (
    <div 
      data-avatar-container
      style={{ width:'100%', height:400 }} 
      className="rounded-2xl overflow-hidden bg-gradient-to-br from-black/20 to-transparent"
    >
      <Canvas
        camera={{ position:[0, 0.4, 3.0], fov: 45 }}
        shadows
        gl={{
          antialias: true,        // Enable anti-aliasing for smooth edges
          alpha: true,           // Enable transparency support
          powerPreference: "high-performance"  // Use dedicated GPU if available
        }}
      >
        {/* Professional Lighting Setup */}
        {/* Ambient light provides overall illumination */}
        <ambientLight intensity={0.5} />
        
        {/* Main directional light for primary illumination and shadows */}
        <directionalLight
          position={[5, 5, 5]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        
        {/* Secondary directional light for fill lighting */}
        <directionalLight
          position={[-5, 5, -5]}
          intensity={0.8}
          color="#4F46E5"  // Indigo color for subtle color variation
        />
        
        {/* Point light for additional depth */}
        <pointLight
          position={[0, 5, 0]}
          intensity={0.6}
          color="#06B6D4"  // Cyan color for modern look
        />
        
        {/* Spot light for focused illumination */}
        <spotLight
          position={[0, 10, 0]}
          angle={0.3}
          penumbra={1}
          intensity={0.4}
          color="#ffffff"  // White color for clean lighting
        />

        {/* Suspense wrapper for loading state */}
        <Suspense fallback={null}>
          <Stage
            environment="city"     // Professional environment backdrop
            intensity={0.6}        // Moderate environment lighting
            shadows={true}        // Enable shadow casting
            adjustCamera={false}   // Prevent automatic camera adjustment
            center={[0, 0.2, 0]}  // Center point for proper framing
          >
            <AvatarModel />
          </Stage>
        </Suspense>

        {/* Enhanced Environment for realistic reflections */}
        <Environment preset="city" />

        {/* Disabled OrbitControls to maintain stable view */}
        <OrbitControls
          enableZoom={false}      // Disable zooming
          enablePan={false}       // Disable panning
          enableRotate={false}    // Disable rotation
          autoRotate={false}      // Disable auto-rotation
          maxPolarAngle={Math.PI / 2}  // Limit vertical rotation
          minPolarAngle={Math.PI / 3}  // Set minimum vertical angle
        />
      </Canvas>
    </div>
  )
}

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm.js';

function ParticleGlobe(props) {
  const ref = useRef();
  
  // Generate random points in a sphere shell
  const [sphere] = useState(() => {
    try {
      const data = random.inSphere(new Float32Array(3000), { radius: 1.8 });
      // Ensure there are no NaNs in positions which crash Three.js
      return Array.from(data).every(v => !isNaN(v)) ? data : new Float32Array(3000);
    } catch (e) {
      // Fallback
      const fallback = new Float32Array(3000);
      for (let i = 0; i < 3000; i++) {
        fallback[i] = (Math.random() - 0.5) * 3;
      }
      return fallback;
    }
  });

  // Slow automatic rotation with mouse drift response
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
      
      // Respond to mouse coordinate drifts
      const { x, y } = state.pointer;
      ref.current.rotation.x += (y * 0.2 - ref.current.rotation.x) * 0.05;
      ref.current.rotation.y += (x * 0.2 - ref.current.rotation.y) * 0.05;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color="#ec590f"
          size={0.012}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.6}
        />
      </Points>
    </group>
  );
}

export default function HeroCanvas() {
  const [webGLSupported, setWebGLSupported] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const support = !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
      setWebGLSupported(support);
    } catch (e) {
      setWebGLSupported(false);
    }
  }, []);

  if (!webGLSupported) {
    // Elegant fallback: fading animated glowing grids
    return (
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(236,89,15,0.12),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(236,89,15,0.1),rgba(8,8,9,0))]" />
    );
  }

  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-80 select-none">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 2, 2]} intensity={1.5} />
        <ParticleGlobe />
      </Canvas>
      {/* Visual fading gradient masking */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-light/40 to-brand-light dark:via-brand-dark/40 dark:to-brand-dark pointer-events-none" />
    </div>
  );
}

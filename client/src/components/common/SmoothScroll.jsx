import React, { createContext, useContext, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SmoothScrollContext = createContext(null);

export const useSmoothScroll = () => useContext(SmoothScrollContext);

export default function SmoothScroll({ children }) {
  const lenisRef = useRef(null);

  useEffect(() => {
    // Instantiate Lenis inertial scrolling engine
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Natural cubic ease-out
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      smoothTouch: false, // Standard touch scroll is preferred on mobile to prevent jitters
    });

    lenisRef.current = lenis;

    // Connect Lenis scroll ticks to GSAP ScrollTrigger updates
    lenis.on('scroll', () => {
      ScrollTrigger.update();
    });

    // Run GSAP ticker updates
    const updateTicker = (time) => {
      lenis.raf(time * 1000);
    };
    
    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0); // Sync latency frame drops

    // Clean up
    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
    };
  }, []);

  return (
    <SmoothScrollContext.Provider value={lenisRef.current}>
      {children}
    </SmoothScrollContext.Provider>
  );
}

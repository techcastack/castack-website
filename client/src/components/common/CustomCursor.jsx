import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [hidden, setHidden] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // High performance mouse tracking values
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth springs for tracking momentum
  const springConfig = { damping: 40, stiffness: 400, mass: 0.4 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Check if device is mobile or touch based
    const checkDevice = () => {
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsMobile(isTouch);
      if (isTouch) {
        document.body.style.cursor = 'auto';
      }
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);

    if (isMobile) return;

    const handleMouseMove = (e) => {
      mouseX.set(e.clientX - 12);
      mouseY.set(e.clientY - 12);
      if (hidden) setHidden(false);
    };

    const handleMouseLeave = () => {
      setHidden(true);
    };

    const handleMouseEnter = () => {
      setHidden(false);
    };

    // Attach listeners
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Hover detection for interactive targets
    const addHoverListeners = () => {
      const targets = document.querySelectorAll(
        'a, button, input, select, textarea, [role="button"], .interactive, img, h1, h2, h3, h4'
      );
      
      targets.forEach((target) => {
        target.addEventListener('mouseenter', () => setHovered(true));
        target.addEventListener('mouseleave', () => setHovered(false));
      });
    };

    // Monitor DOM mutations to bind new elements
    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });
    
    addHoverListeners();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('resize', checkDevice);
      observer.disconnect();
    };
  }, [mouseX, mouseY, hidden, isMobile]);

  if (isMobile || hidden) return null;

  return (
    <>
      {/* Outer Tracking Ring */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border border-brand-orange rounded-full pointer-events-none z-[9999]"
        style={{
          x: cursorX,
          y: cursorY,
          scale: hovered ? 1.5 : 1,
          backgroundColor: hovered ? 'rgba(236, 89, 15, 0.08)' : 'rgba(236, 89, 15, 0)',
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
      />
      {/* Inner Pin Dot */}
      <motion.div
        className="fixed top-2 left-2 w-4 h-4 bg-brand-orange rounded-full pointer-events-none z-[9999]"
        style={{
          x: cursorX,
          y: cursorY,
          scale: hovered ? 0.3 : 1,
        }}
        transition={{ type: 'spring', stiffness: 800, damping: 35 }}
      />
    </>
  );
}

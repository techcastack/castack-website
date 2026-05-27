import React from 'react';
import { motion } from 'framer-motion';

const curtainVariants = {
  initial: {
    y: '100%',
  },
  animate: {
    y: ['100%', '0%', '-100%'],
    transition: {
      duration: 1.0,
      ease: [0.76, 0, 0.24, 1], // Custom premium bezier
    },
  },
};

const contentVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: 0.4, // Wait for curtain to cover before revealing content
      ease: [0.25, 1, 0.5, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.4,
      ease: [0.25, 0, 0.5, 0],
    },
  },
};

export default function PageTransition({ children }) {
  return (
    <div className="relative w-full min-h-screen">
      {/* Orange Overlay Slide Transition */}
      <motion.div
        className="fixed inset-0 bg-brand-orange z-[99999] pointer-events-none origin-bottom"
        variants={curtainVariants}
        initial="initial"
        animate="animate"
      />
      {/* Page Content Holder */}
      <motion.div
        variants={contentVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="w-full min-h-screen"
      >
        {children}
      </motion.div>
    </div>
  );
}

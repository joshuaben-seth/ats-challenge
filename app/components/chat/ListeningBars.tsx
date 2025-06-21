'use client';

import { motion, Variants } from 'framer-motion';

const barVariants: Variants = {
  initial: {
    height: '4px',
  },
  animate: {
    height: ['4px', '16px', '4px'],
    transition: {
      duration: 1.2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export default function ListeningBars() {
  return (
    <div className="flex items-end justify-center gap-0.5 w-4 h-4">
      <motion.div
        className="w-1 bg-primary-foreground rounded-full"
        variants={barVariants}
        initial="initial"
        animate="animate"
        style={{ transitionDelay: '0s' }}
      />
      <motion.div
        className="w-1 bg-primary-foreground rounded-full"
        variants={barVariants}
        initial="initial"
        animate="animate"
        style={{ transitionDelay: '0.2s' }}
      />
      <motion.div
        className="w-1 bg-primary-foreground rounded-full"
        variants={barVariants}
        initial="initial"
        animate="animate"
        style={{ transitionDelay: '0.4s' }}
      />
    </div>
  );
} 
'use client';

import { motion } from 'framer-motion';

const BAR_COUNT = 3;
const DURATION = 1.2;
const DELAY_STEP = 0.2;

export default function ListeningBars() {
  return (
    <div className="flex items-end justify-center gap-0.5 w-4 h-4">
      {Array.from({ length: BAR_COUNT }).map((_, i) => (
        <motion.div
          key={i}
          className="w-1 bg-primary-foreground rounded-full"
          initial={{ height: '4px' }}
          animate={{ height: ['4px', '16px', '4px'] }}
          transition={{
            duration: DURATION,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * DELAY_STEP,
          }}
        />
      ))}
    </div>
  );
} 
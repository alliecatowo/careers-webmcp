'use client';

import { motion } from 'framer-motion';

export function AnimatedMain({ children }: { children: React.ReactNode }) {
  return (
    <motion.main
      id='main-content'
      className='flex-1'
      tabIndex={-1}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.main>
  );
}

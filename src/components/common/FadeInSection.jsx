'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const fadeInVariants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1], // Custom easing for smooth motion
    },
  },
};

export default function FadeInSection({ 
  children, 
  className = '',
  delay = 0,
  direction = 'up' // 'up', 'down', 'left', 'right'
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: true, 
    margin: '-100px',
    amount: 0.2 
  });

  // Adjust animation based on direction
  const getInitialPosition = () => {
    switch (direction) {
      case 'down':
        return { opacity: 0, y: -30 };
      case 'left':
        return { opacity: 0, x: 30 };
      case 'right':
        return { opacity: 0, x: -30 };
      default:
        return { opacity: 0, y: 30 };
    }
  };

  const getFinalPosition = () => {
    switch (direction) {
      case 'down':
      case 'left':
      case 'right':
        return { opacity: 1, x: 0, y: 0 };
      default:
        return { opacity: 1, y: 0 };
    }
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={getInitialPosition()}
      animate={isInView ? getFinalPosition() : getInitialPosition()}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

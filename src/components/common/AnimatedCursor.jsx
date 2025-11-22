'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function AnimatedCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [cursorVariant, setCursorVariant] = useState('default');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if device has touch capability
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(pointer: coarse)').matches) {
      return; // Don't show cursor on touch devices
    }

    let rafId = null;

    const handleMouseMove = (e) => {
      // Use requestAnimationFrame for smooth updates
      if (rafId) cancelAnimationFrame(rafId);
      
      setIsVisible(true);
      rafId = requestAnimationFrame(() => {
        setMousePosition({
          x: e.clientX,
          y: e.clientY,
        });
      });
    };

    const checkIfClickable = (element) => {
      if (!element) return false;
      
      const tagName = element.tagName?.toLowerCase();
      const computedStyle = window.getComputedStyle(element);
      const cursor = computedStyle.cursor;
      
      // Check multiple conditions for clickable elements
      return (
        tagName === 'a' ||
        tagName === 'button' ||
        element.closest('a') ||
        element.closest('button') ||
        element.getAttribute('role') === 'button' ||
        element.getAttribute('role') === 'link' ||
        cursor === 'pointer' ||
        element.classList.contains('cursor-pointer') ||
        element.hasAttribute('onclick') ||
        element.onclick !== null ||
        (element.tagName === 'INPUT' && element.type === 'submit') ||
        (element.tagName === 'INPUT' && element.type === 'button')
      );
    };

    const handleMouseOver = (e) => {
      if (checkIfClickable(e.target)) {
        setIsHovering(true);
        setCursorVariant('hover');
      } else {
        setIsHovering(false);
        setCursorVariant('default');
      }
    };

    const handleMouseOut = () => {
      setIsHovering(false);
      setCursorVariant('default');
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, { capture: true, passive: true });
    document.addEventListener('mouseout', handleMouseOut, { capture: true, passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver, { capture: true });
      document.removeEventListener('mouseout', handleMouseOut, { capture: true });
    };
  }, []);

  // Hide cursor on touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  const cursorVariants = {
    default: {
      width: 20,
      height: 20,
      x: mousePosition.x - 10,
      y: mousePosition.y - 10,
      transition: {
        type: 'spring',
        stiffness: 500,
        damping: 28,
      },
    },
    hover: {
      width: 48,
      height: 48,
      x: mousePosition.x - 24,
      y: mousePosition.y - 24,
      transition: {
        type: 'spring',
        stiffness: 500,
        damping: 28,
      },
    },
  };

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
      variants={cursorVariants}
      animate={cursorVariant}
      style={{
        transform: 'translate3d(0, 0, 0)',
      }}
    >
      {/* Outer glow ring */}
      <motion.div
        className="absolute rounded-full border-2 border-white"
        style={{
          width: '150%',
          height: '150%',
          top: '-25%',
          left: '-25%',
          filter: isHovering 
            ? 'blur(8px) drop-shadow(0 0 20px rgba(255, 255, 255, 0.6))'
            : 'blur(4px) drop-shadow(0 0 10px rgba(255, 255, 255, 0.4))',
        }}
        animate={{
          scale: isHovering ? 1.3 : 1.1,
          opacity: isHovering ? 0.9 : 0.7,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
        }}
      />
      
      {/* Main cursor dot */}
      <motion.div
        className="absolute rounded-full bg-white"
        style={{
          width: '100%',
          height: '100%',
          filter: isHovering 
            ? 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.8)) drop-shadow(0 0 30px rgba(255, 255, 255, 0.5))'
            : 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.7)) drop-shadow(0 0 16px rgba(255, 255, 255, 0.4))',
        }}
        animate={{
          scale: isHovering ? 1.25 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 25,
        }}
      />
    </motion.div>
  );
}

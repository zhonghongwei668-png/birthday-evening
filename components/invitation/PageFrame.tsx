"use client";

import { motion, type Variants } from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";

const pageVariants: Variants = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

interface PageFrameProps {
  children: ReactNode;
  className?: string;
  labelledBy?: string;
}

export function PageFrame({
  children,
  className = "",
  labelledBy,
}: PageFrameProps) {
  const pageRef = useRef<HTMLElement>(null);

  useEffect(() => {
    pageRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <motion.section
      ref={pageRef}
      tabIndex={-1}
      aria-labelledby={labelledBy}
      className={`invitation-page ${className}`}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.46, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.section>
  );
}

"use client";

import { motion } from "motion/react";
import { ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
  duration?: number;
  once?: boolean;
}

export function FadeIn({
  children,
  delay = 0,
  className = "",
  direction = "up",
  duration = 0.9,
  once = true,
}: FadeInProps) {
  const directionOffset = {
    up:    { y: 36, x: 0 },
    down:  { y: -36, x: 0 },
    left:  { x: 40, y: 0 },
    right: { x: -40, y: 0 },
  }[direction];

  return (
    <motion.div
      initial={{ opacity: 0, ...directionOffset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, margin: "-60px" }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1], // expo ease-out — very premium feel
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

"use client";

import { motion } from "motion/react";

export function RippleDivider() {
  return (
    <div className="w-full flex justify-center py-12 md:py-16 overflow-hidden">
      <motion.svg
        width="120"
        height="20"
        viewBox="0 0 120 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      >
        <motion.path
          d="M0 10 C 20 -5, 40 -5, 60 10 C 80 25, 100 25, 120 10"
          stroke="var(--color-sage)"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
      </motion.svg>
    </div>
  );
}

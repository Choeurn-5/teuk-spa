"use client";

import { motion } from "motion/react";

interface Stat {
  value: string;
  label: string;
}

interface StatsBarProps {
  stats: Stat[];
}

export default function StatsBar({ stats }: StatsBarProps) {
  return (
    <div
      className="py-10 px-6"
      style={{ backgroundColor: "#4A5240" }}
    >
      <div className="max-w-4xl mx-auto grid grid-cols-3 divide-x divide-white/20">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.15 }}
            className="flex flex-col items-center justify-center gap-1 px-4 py-4 text-center"
          >
            <span
              className="text-[#C9A84C] text-4xl sm:text-5xl font-light"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {stat.value}
            </span>
            <span
              className="text-white/60 text-xs uppercase tracking-[0.2em] mt-1"
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              {stat.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

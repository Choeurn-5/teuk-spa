"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";

interface Treatment {
  image: string;
  name: string;
  duration: string;
  price: string;
  href: string;
}

interface TreatmentCardProps {
  treatment: Treatment;
  index?: number;
}

export default function TreatmentCard({ treatment, index = 0 }: TreatmentCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, ease: "easeOut", delay: index * 0.15 }}
      whileHover={{ y: -8, transition: { duration: 0.3, ease: "easeOut" } }}
      className="group flex flex-col rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-shadow duration-300"
      style={{ backgroundColor: "#FAF7F2" }}
    >
      {/* Image */}
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        <Image
          src={treatment.image}
          alt={treatment.name}
          fill
          quality={80}
          className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
        />
        {/* Price badge */}
        <div
          className="absolute top-4 right-4 px-4 py-1.5 rounded-full text-xs uppercase tracking-widest font-medium"
          style={{
            backgroundColor: "#4A5240",
            color: "#C9A84C",
            fontFamily: "'Jost', sans-serif",
            letterSpacing: "0.16em",
          }}
        >
          {treatment.price}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-3 p-7">
        <h3
          className="font-serif text-2xl font-light text-[#2C2C2C] leading-tight"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          {treatment.name}
        </h3>
        <div className="flex items-center gap-2">
          <svg
            viewBox="0 0 16 16"
            fill="none"
            className="w-4 h-4 flex-shrink-0"
            stroke="#7A8C6E"
            strokeWidth="1.4"
          >
            <circle cx="8" cy="8" r="6" />
            <path d="M8 5v3l2 1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span
            className="text-[#7A8C6E] text-xs uppercase tracking-widest"
            style={{ fontFamily: "'Jost', sans-serif", letterSpacing: "0.18em" }}
          >
            {treatment.duration}
          </span>
        </div>
        <div className="h-px w-full mt-1" style={{ backgroundColor: "#E8E4DC" }} />
        <Link
          href={treatment.href}
          className="inline-flex items-center gap-2 text-[#4A5240] text-xs uppercase tracking-widest font-medium mt-1 group/link"
          style={{ fontFamily: "'Jost', sans-serif", letterSpacing: "0.16em" }}
        >
          <span className="border-b border-[#4A5240]/30 pb-0.5 group-hover/link:border-[#C9A84C] group-hover/link:text-[#C9A84C] transition-colors duration-300">
            Learn More
          </span>
          <svg
            className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform duration-300"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </motion.div>
  );
}

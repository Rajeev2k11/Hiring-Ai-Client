"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface RevealProps extends HTMLMotionProps<"div"> {
  /** Stagger order — multiplied into the delay for sequential reveals. */
  index?: number;
  delay?: number;
  y?: number;
  once?: boolean;
}

/**
 * Scroll-reveal wrapper (Framer Motion `whileInView`). Used for the bulk of
 * section entrances; GSAP is reserved for the hero + signature timelines.
 * Honors reduced-motion via Framer's built-in reducedMotion handling.
 */
export function Reveal({
  children,
  className,
  index = 0,
  delay = 0,
  y = 24,
  once = true,
  ...props
}: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-80px" }}
      transition={{
        duration: 0.7,
        delay: delay + index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

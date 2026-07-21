"use client";

import { motion, type HTMLMotionProps } from "motion/react";

/**
 * Small motion helpers used across the app so animation stays consistent and in
 * one place. `motion` already honours `prefers-reduced-motion` at the browser
 * level via reduced motion in transitions; we keep movements subtle regardless.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

/** Fade + rise on mount. `delay` staggers siblings. */
export function FadeIn({
  children,
  delay = 0,
  y = 12,
  className,
  ...props
}: HTMLMotionProps<"div"> & { delay?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE, delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/** Container that staggers its FadeIn/motion children. */
export function Stagger({
  children,
  className,
  stagger = 0.07,
  ...props
}: HTMLMotionProps<"div"> & { stagger?: number }) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger } },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/** A child item for use inside <Stagger>. */
export function StaggerItem({
  children,
  className,
  y = 12,
  ...props
}: HTMLMotionProps<"div"> & { y?: number }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y },
        show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export { motion };

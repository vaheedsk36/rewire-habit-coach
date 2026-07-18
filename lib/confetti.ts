import confetti from "canvas-confetti";

/** Whether the user has asked for reduced motion. */
function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** A celebratory burst — used on wins and milestones. No-op if reduced motion. */
export function celebrate(): void {
  if (prefersReducedMotion()) return;
  const colors = ["#22c55e", "#16a34a", "#4ade80", "#bbf7d0"];
  confetti({ particleCount: 90, spread: 70, origin: { y: 0.7 }, colors });
  setTimeout(
    () => confetti({ particleCount: 50, angle: 60, spread: 55, origin: { x: 0 }, colors }),
    150,
  );
  setTimeout(
    () => confetti({ particleCount: 50, angle: 120, spread: 55, origin: { x: 1 }, colors }),
    250,
  );
}

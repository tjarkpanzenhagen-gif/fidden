"use client";

import { useEffect, useRef } from "react";

type From = "up" | "down" | "left" | "right";

export default function RevealSection({
  children,
  className = "",
  delay = 0,
  from = "up",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  from?: From;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add("in"), delay);
          io.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`reveal ${className}`} data-from={from}>
      {children}
    </div>
  );
}

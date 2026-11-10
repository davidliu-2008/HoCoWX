"use client";

import { useEffect, useRef, useState } from "react";

export function AnimatedStat({
  target,
  suffix = "+",
  decimals = 0
}: {
  target: number;
  suffix?: string;
  decimals?: number;
}) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setValue(target);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const startedAt = performance.now();
      const duration = 2400;

      function frame(now: number) {
        const progress = Math.min((now - startedAt) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(target * eased);
        if (progress < 1) requestAnimationFrame(frame);
      }

      requestAnimationFrame(frame);
    }, { threshold: 0.35 });

    observer.observe(element);
    return () => observer.disconnect();
  }, [target]);

  const formatted = value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });

  return <p ref={ref} className="text-4xl font-black text-bay tabular-nums sm:text-5xl">{formatted}{suffix}</p>;
}

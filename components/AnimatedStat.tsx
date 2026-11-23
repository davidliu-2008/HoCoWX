"use client";

import { useEffect, useRef, useState } from "react";

export function AnimatedStat({
  target,
  suffix = "+",
  decimals = 0,
  className = "text-bay"
}: {
  target: number;
  suffix?: string;
  decimals?: number;
  className?: string;
}) {
  const [value, setValue] = useState(target);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setValue(target);
      return;
    }

    let frameId = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const startedAt = performance.now();
      const duration = 2400;

      function frame(now: number) {
        const progress = Math.min((now - startedAt) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(target * eased);
        if (progress < 1) frameId = requestAnimationFrame(frame);
      }

      frameId = requestAnimationFrame(frame);
    }, { threshold: 0.35 });

    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frameId);
    };
  }, [target]);

  const formatted = value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });

  const accessibleValue = `${target.toLocaleString("en-US", { maximumFractionDigits: decimals })}${suffix}`;

  return (
    <p ref={ref} className={`text-4xl font-black tabular-nums sm:text-5xl ${className}`}>
      <span className="sr-only">{accessibleValue}</span>
      <span aria-hidden="true">{formatted}{suffix}</span>
    </p>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";

export function LiteracyGuideNav({ guides }: { guides: { href: string; number: string; title: string }[] }) {
  const sticky = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState("");
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const update = () => {
      const edge = (sticky.current?.getBoundingClientRect().bottom ?? 0) + 40;
      const current = guides.filter(({ href }) => {
        const section = document.getElementById(href.slice(1));
        return section && section.getBoundingClientRect().top <= edge;
      }).at(-1);
      setActive(current?.href ?? "");
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [guides]);

  useEffect(() => {
    const nav = sticky.current?.querySelector("nav");
    const link = nav?.querySelector<HTMLAnchorElement>('[aria-current="location"]');
    if (!nav || !link) return;
    const update = () => setIndicator({ left: link.offsetLeft, width: link.offsetWidth });
    const observer = new ResizeObserver(update);
    observer.observe(nav);
    observer.observe(link);
    update();
    const left = link.offsetLeft;
    if (left < nav.scrollLeft || left + link.offsetWidth > nav.scrollLeft + nav.clientWidth) {
      nav.scrollLeft = left - 8;
    }
    return () => observer.disconnect();
  }, [active]);

  return (
    <div ref={sticky} className="sticky top-28 z-30 lg:top-20">
      <nav className="relative flex gap-2 overflow-x-auto bg-white p-2 shadow-panel" aria-label="Weather literacy guides">
        {guides.map((guide) => (
          <a key={guide.href} href={guide.href} aria-current={active === guide.href ? "location" : undefined} className="flex min-h-11 shrink-0 items-center gap-3 px-4 py-3 text-sm font-bold text-ink hover:bg-blue-50 aria-[current=location]:text-bay">
            <span className="text-bay">{guide.number}</span>{guide.title}
          </a>
        ))}
        <span aria-hidden="true" className="pointer-events-none absolute top-12 h-0.5 bg-bay motion-safe:transition-[transform,width] motion-safe:duration-300" style={{ width: active ? indicator.width : 0, transform: `translateX(${indicator.left - 8}px)` }} />
      </nav>
    </div>
  );
}

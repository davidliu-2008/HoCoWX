"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    instgrm?: { Embeds?: { process: () => void } };
  }
}

export function InstagramEmbeds({ urls }: { urls: string[] }) {
  useEffect(() => {
    const existingScript = document.querySelector<HTMLScriptElement>("script[data-instagram-embed]");

    if (existingScript) {
      window.instgrm?.Embeds?.process();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://www.instagram.com/embed.js";
    script.async = true;
    script.dataset.instagramEmbed = "true";
    script.onload = () => window.instgrm?.Embeds?.process();
    document.body.appendChild(script);
  }, []);

  return (
    <div className="grid items-start gap-5 lg:grid-cols-2">
      {urls.map((url) => (
        <blockquote
          key={url}
          className="instagram-media !m-0 !min-w-0 !max-w-none !w-full rounded-lg bg-white"
          data-instgrm-permalink={url}
          data-instgrm-version="14"
        >
          <a href={url} target="_blank" rel="noreferrer" className="block p-6 font-semibold text-bay">
            View this post on Instagram
          </a>
        </blockquote>
      ))}
    </div>
  );
}

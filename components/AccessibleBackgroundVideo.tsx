"use client";

import { useEffect, useRef, useState } from "react";

export function AccessibleBackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      videoRef.current?.pause();
      setPlaying(false);
    }
  }, []);

  async function togglePlayback() {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      await video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  }

  return (
    <>
      <video
        ref={videoRef}
        className="literacy-video-hero__media"
        autoPlay
        muted
        loop
        playsInline
        poster="/photography/snowfall-video-poster.jpg"
        aria-hidden="true"
        tabIndex={-1}
      >
        <source src="/video/snowfall-background.m4v" type="video/mp4" />
      </video>
      <button
        type="button"
        onClick={() => void togglePlayback()}
        className="absolute bottom-4 right-4 z-20 inline-flex min-h-11 items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-bold text-navy shadow-lg hover:bg-blue-50"
        aria-label={playing ? "Pause background snowfall video" : "Play background snowfall video"}
      >
        {playing ? "Pause motion" : "Play motion"}
      </button>
    </>
  );
}

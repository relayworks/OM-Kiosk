"use client";

import { useEffect, useRef } from "react";

export default function ReStageHodongStage({
  active = true,
  embedded = false,
  playbackKey = 0,
  onEnded,
}) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    try {
      video.currentTime = 0;
    } catch {
      video.load();
    }

    if (!active) {
      video.pause();
      return;
    }

    const playTimer = setTimeout(() => {
      video.muted = false;
      video.play().catch((error) => {
        if (error?.name !== "NotAllowedError") {
          console.warn("Failed to play Hodong restage video:", error);
          return;
        }

        video.muted = true;
        video.play().catch((mutedError) => {
          console.warn("Failed to play muted Hodong restage video:", mutedError);
        });
      });
    }, 2000);

    return () => clearTimeout(playTimer);
  }, [active, playbackKey]);

  return (
    <div
      className="stage hodong restage-video-stage"
      aria-hidden={!active}
      style={
        embedded
          ? {
              position: "fixed",
              inset: 0,
              zIndex: active ? 30 : -1,
              opacity: active ? 1 : 0,
              pointerEvents: active ? "auto" : "none",
              transform: "translateZ(0)",
            }
          : undefined
      }
    >
      <video
        ref={videoRef}
        className="restage-video"
        src="/reStage/Hodong.mp4"
        preload="auto"
        playsInline
        autoPlay={active}
        onEnded={onEnded}
      />
    </div>
  );
}

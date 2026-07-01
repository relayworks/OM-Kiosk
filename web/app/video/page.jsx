"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import HiddenExit from "../../components/hiddenExit";
import { fetchContent } from "../lib/content-client";

export default function videoHome() {
  const [videoData, setVideoData] = useState(null);
  const sections = videoData?.sections || [];
  const preloadSources = useMemo(() => {
    const sources = sections
      .flatMap((section) => section.videos || [])
      .filter((video) => video.enabled !== false && video.video)
      .map((video) => video.video);

    return [...new Set(sources)];
  }, [sections]);

  useEffect(() => {
    fetchContent("videos")
      .then(setVideoData)
      .catch((error) => {
        console.warn("Failed to load video content:", error);
      });
  }, []);

  return (
    <>
    <HiddenExit/>
      <div className="video-preload-bucket" aria-hidden="true">
        {preloadSources.map((src) => (
          <video key={src} src={src} preload="auto" muted playsInline />
        ))}
      </div>
      <div className="QRnav">
        <header className="relative video-header">
          〈한국 오페라 첫 15년의 궤적 1948-1962〉 <br />
          {videoData?.title || "관람 후기 및 출연 소감"}{" "}
        </header>
        {sections.map((section, sectionIndex) => (
          <div className="row" key={section.id || sectionIndex}>
            <h3>{section.title}</h3>
            {(section.videos || [])
              .filter((video) => video.enabled !== false)
              .map((video) => (
                <Link href={`video/${video.id}`} key={video.id}>
                  <div>
                    <img src={video.thumbnail} alt="" />
                    <br />
                    <span>{video.name}</span>
                  </div>
                </Link>
              ))}
            {sectionIndex === sections.length - 1 && (
              <div className="alertPick">
                <div className="touch">
                  <div className="touchIcon"></div>
                  <span>선택하여 영상을 재생하세요</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <style jsx>{`
        .video-preload-bucket {
          position: fixed;
          width: 1px;
          height: 1px;
          overflow: hidden;
          opacity: 0;
          pointer-events: none;
        }
      `}</style>
    </>
  );
}

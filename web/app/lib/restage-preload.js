"use client";

const chunheeAssets = ["/reStage/Chunhee.mp4"];
const hodongAssets = ["/reStage/Hodong.mp4"];

const assetGroups = {
  chunhee: chunheeAssets,
  hodong: hodongAssets,
  all: [...chunheeAssets, ...hodongAssets],
};

const preloadCache = new Map();
const videoRefs = [];

function preloadVideo(src) {
  if (preloadCache.has(src)) return preloadCache.get(src);

  const promise = new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "auto";
    video.playsInline = true;
    video.onloadeddata = () => resolve(src);
    video.onerror = () => resolve(src);
    video.src = src;
    video.load();
    videoRefs.push(video);
  });

  preloadCache.set(src, promise);
  return promise;
}

export function preloadRestageAssets(group = "all") {
  if (typeof window === "undefined") return Promise.resolve([]);

  const assets = assetGroups[group] || assetGroups.all;
  window.__restagePreloadedVideos = videoRefs;

  return Promise.all(assets.map(preloadVideo));
}

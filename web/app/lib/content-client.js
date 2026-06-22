"use client";

export async function fetchContent(type) {
  const response = await fetch(`/api/content/${type}`, { cache: "no-store" });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `Failed to load ${type}`);
  }

  return data;
}

export function getCollectionImage(item) {
  return item?.media?.cover || `/media/flowImg/${item?.serial}.jpg`;
}

export function getFigureImage(item) {
  return item?.media?.portrait || `/${item?.nameEn}.jpg`;
}

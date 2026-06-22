
"use client";

import { useEffect, useState, useRef } from "react";
import { getKioskSocket } from "../lib/kiosk-socket";
import { fetchContent, getCollectionImage } from "../lib/content-client";
import { preloadRestageAssets } from "../lib/restage-preload";
import ReStageChunheeStage from "../restage_chunhee/ReStageChunheeStage";
import ReStageHodongStage from "../restage_hodong/ReStageHodongStage";
import { useRouter } from "next/navigation"; // Next.js 라우터 가져오기


export default function Coverflow() {
      const router = useRouter(); // Next.js 라우터 초기화

  const [currentIndex, setCurrentIndex] = useState(0); // 현재 커버플로우 인덱스
  const [progress, setProgress] = useState(0);
  const [collectOn, setCollectOn] = useState(false);
  const [animateCt, setAnimateCt] = useState(false);
  const [moveOn, setMoveOn] = useState(false);
  const [activeRestage, setActiveRestage] = useState(null);
  const [restagePlaybackKey, setRestagePlaybackKey] = useState(0);
  const [timeoutId, setTimeoutId] = useState(null); // 타이머 ID 상태로 관리
  const [mounted, setMounted] = useState(false);
  const [collectData, setCollectData] = useState([]);
  const collectDataRef = useRef([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    fetchContent("collect")
      .then((data) => {
        const items = data.items || [];
        collectDataRef.current = items;
        setCollectData(items);
      })
      .catch((error) => {
        console.warn("Failed to load collect content:", error);
      });
  }, []);

  useEffect(() => {
    router.prefetch("/restage_chunhee");
    router.prefetch("/restage_hodong");
    preloadRestageAssets("all");
  }, [router]);

  function getVHValue(vh) {
    if (typeof window !== "undefined") {
      const viewportHeight = window.innerHeight; // 현재 브라우저의 뷰포트 높이
      return (vh / 100) * viewportHeight; // 원하는 vh 값 반환
    }
    return 0; // 서버사이드에서는 0 반환
  }

  const heightInPixels = getVHValue(50); // 커버 이동 시 사용할 픽셀 값 예시
  function updateScrollIndicator() {
    const totalItems = Math.max(collectData.length - 1, 1); // 항목 개수
    const percentage = (currentIndex / totalItems) * 100; // 퍼센트 계산
    setProgress(percentage);
  }
  const timeoutRef = useRef(null);

  const resetToIdle = () => {
    setActiveRestage(null);
    setMoveOn(false);
    setCollectOn(false);
    setAnimateCt(false);
  };

  const handleRestageEnded = () => {
    resetToIdle();
    const socket = getKioskSocket();
    socket.emit("kiosk:done", { current: "idle" });
    socket.emit("pageStatus", { state: "done", target: "prevPage" });
  };

  useEffect(() => {
      const socket = getKioskSocket();
    const clearPreviousTimeout = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
    // ✅ 마운트 1회만: 키오스크 준비 선언(Idle 화면)
    socket.emit("kiosk:ready", { current: "idle" });

    const onUpdateCoverflow = (direction) => {
      const itemCount = collectDataRef.current.length;
      if (!itemCount) return;

      if (direction === "next") {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % itemCount);
      } else if (direction === "prev") {
        setCurrentIndex(
          (prevIndex) =>
            (prevIndex - 1 + itemCount) % itemCount,
        );
      }
    };

    const onHandleContentChange = (contentSelect) => {
      setCurrentIndex(contentSelect);
    };

    const onChangePage = (contentSelect) => {
      clearPreviousTimeout();

      // 컨트롤러 잠금용 상태 (서버가 pageStatus를 쏘도록 바꿔도 되지만,
      // 지금은 키오스크가 직접 알려주는 편이 확실함)
      socket.emit("pageStatus", { state: "accepted", target: contentSelect });

      if (contentSelect === "collect") {
        socket.emit("kiosk:busy", { current: "collect" });
        timeoutRef.current = setTimeout(() => {
          setAnimateCt(false);
          setCollectOn(true);
          socket.emit("kiosk:done", { current: "collect" });
          socket.emit("pageStatus", { state: "done", target: contentSelect });
        }, 1000);
        return;
      }

      if (contentSelect === "prevPage") {
        socket.emit("kiosk:busy", { current: "idle" });
        resetToIdle();
        timeoutRef.current = setTimeout(() => {
          setAnimateCt(true);
          socket.emit("kiosk:done", { current: "idle" });
          socket.emit("pageStatus", { state: "done", target: contentSelect });
        }, 6000);
        return;
      }

      if (contentSelect === "reStageChunhee") {
        socket.emit("kiosk:busy", { current: "restage_chunhee" });
        socket.emit("pageStatus", {
          state: "navigating",
          target: contentSelect,
        });
        preloadRestageAssets("chunhee");

        setAnimateCt(false);
        setCollectOn(true);
        setMoveOn(true);
        setRestagePlaybackKey((prevKey) => prevKey + 1);
        setActiveRestage("chunhee");
        socket.emit("kiosk:done", { current: "restage_chunhee" });
        socket.emit("pageStatus", { state: "done", target: contentSelect });
        return;
      }

      if (contentSelect === "reStageHodong") {
        socket.emit("kiosk:busy", { current: "restage_hodong" });
        socket.emit("pageStatus", {
          state: "navigating",
          target: contentSelect,
        });
        preloadRestageAssets("hodong");

        setAnimateCt(false);
        setCollectOn(true);
        setMoveOn(true);
        setRestagePlaybackKey((prevKey) => prevKey + 1);
        setActiveRestage("hodong");
        socket.emit("kiosk:done", { current: "restage_hodong" });
        socket.emit("pageStatus", { state: "done", target: contentSelect });
        return;
      }
    };

    // ✅ 중복 방지: 먼저 싹 비우고 등록 (컨트롤러 쪽에서 말한 패턴과 동일)
    socket.off("updateCoverflow");
    socket.off("handleContentChange");
    socket.off("changePage");

    socket.on("updateCoverflow", onUpdateCoverflow);
    socket.on("handleContentChange", onHandleContentChange);
    socket.on("changePage", onChangePage);
    const interval = setInterval(() => {
    socket.emit("kiosk:heartbeat");
  }, 2000);

    return () => {
      socket.off("updateCoverflow", onUpdateCoverflow);
      socket.off("handleContentChange", onHandleContentChange);
      socket.off("changePage", onChangePage);
      clearPreviousTimeout();
      clearInterval(interval);
    };

  
  }, [router]); // ✅ timeoutId 제거

  // 커버플로우를 업데이트하는 함수
  const updateCoverflow = () => {
    const covers = document.querySelectorAll(".cover");
    covers.forEach((cover, index) => {
      const offset = index - currentIndex;
      cover.style.transform = `translateX(${
        offset * heightInPixels
      }px) rotateY(${offset * -45}deg)`;
      const img = cover.querySelector("img");
      if (img) {
        img.style.opacity = Math.max(1 - Math.abs(offset) * 0.6, 0);
      }
    });
    updateScrollIndicator();
  };

  useEffect(() => {
    updateCoverflow(); // currentIndex가 변경될 때마다 커버플로우 업데이트
  }, [currentIndex, collectData]);

  const currentCollect = collectData[currentIndex];

  return (
    <div>
      <ReStageChunheeStage
        active={activeRestage === "chunhee"}
        embedded
        playbackKey={restagePlaybackKey}
        onEnded={handleRestageEnded}
      />
      <ReStageHodongStage
        active={activeRestage === "hodong"}
        embedded
        playbackKey={restagePlaybackKey}
        onEnded={handleRestageEnded}
      />
      <div id="container4_3" className={collectOn ? "on" : "disable"}>
        <div className="curtain">
          <div className="curtain_left"></div>
          <div
            className={
              animateCt ? "curtain_right curtain_animate" : "curtain_right"
            }
          ></div>
        </div>
        <div className="exInfoWrap">
          <div className="exInfo"></div>
          <div className="credit"></div>
        </div>
        <div id="coverflow-container">
          <div className={moveOn ? "title moveOn" : "title"}></div>

          <div id="coverflow" className={moveOn ? "moveOn" : "stay"}>
            {collectData.map((collect, idx) => (
              <div
                className={currentIndex === idx ? "cover highlight" : "cover"}
                key={idx}
              >
                <img src={getCollectionImage(collect)} alt="" />
              </div>
            ))}
          </div>
          {currentCollect && <div id="description" className={moveOn ? "moveOn" : "stay"}>
            <div className="upperInfo">
              <span className="year">{currentCollect.year}</span>
              <p className="collectionTitle">
                {currentCollect.titleKo}
                <br />
                {currentCollect.titleEn}
              </p>
            </div>
            <div className="lowerInfo">
              <p>
                {currentCollect.titleKo}{" "}
                {currentCollect.type}
              </p>
              <p>연대: {currentCollect.year}</p>
              <p>자료 크기: {currentCollect.size}</p>
              <p>자료 수량: {currentCollect.quantity}</p>
              <p>
                자료 분량: {currentCollect.pageCount || "정보 없음"}
              </p>
              <p>{currentCollect.donor} 기증</p>
            </div>
          </div>}
          <div className={moveOn ? "scrollWrapper moveOn" : "scrollWrapper"}>
            <span className="scrollYear"> 1948</span>

            <div id="custom-scrollbar">
              <div
                id="scroll-indicator"
                style={{ left: `calc(${progress}% - 10px)` }}
              ></div>
            </div>
            <span className="scrollYear right"> 1962</span>
          </div>
        </div>
      </div>
    </div>
  );
}

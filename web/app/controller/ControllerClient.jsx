
"use client";

import { useEffect, useState, useRef } from "react";
import { getControllerSocket } from "./socket-controller";
import Slider from "react-slick";
import { fetchContent } from "../lib/content-client";

export default function Controller() {
  const [currentContent, setCurrentContent] = useState(0);
  const [status, setStatus] = useState("Idle");
  const [selected, setSelected] = useState("");
  const inactivityTimerRef = useRef(null); // 비활성 타이머 Ref 추가
  const [controlsLocked, setControlsLocked] = useState(false);
  const [statusText, setStatusText] = useState(null);
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [collectData, setCollectData] = useState([]);
  const statusRef = useRef(status);

  const socketRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    fetchContent("collect")
      .then((data) => setCollectData(data.items || []))
      .catch((error) => {
        console.warn("Failed to load collect content:", error);
      });
  }, []);

  useEffect(() => {
    let mounted = true;

    const setupSocket = async () => {
      const s = await getControllerSocket();
      if (!mounted) return;

      socketRef.current = s;

      console.log("controller connected to kiosk");

      // 연결 직후 상태 요청
      s.emit("kiosk:get_status");

      s.on("connect", () => {
        console.log("socket connected");
      });

      s.on("disconnect", () => {
        console.log("socket disconnected");
  setStatusText("서버 연결 끊김");

      });

     s.on("kiosk:status", (state) => {
  if (!state) return;

  // 🔴 키오스크 오프라인
  if (!state.ready) {
    setControlsLocked(true);
    setStatusText("키오스크 연결 대기중...");
    return;
  }

  // 🟡 전환중
  if (state.busy) {
    setControlsLocked(true);
    setStatusText("전환 중…");
    return;
  }

  // 🟢 정상
  setControlsLocked(false);
  setStatusText(null);
  setSelectedTarget(state.current ?? null);

  if (state.current === "idle") {
    setStatus("Idle");
    setSelected("");
  }
  if (state.current === "restage_chunhee") {
    setStatus("Restage");
    setSelected("chunhee");
  }
  if (state.current === "restage_hodong") {
    setStatus("Restage");
    setSelected("hodong");
  }
});

      s.on("pageStatus", (payload) => {
        const { state, reason } = payload || {};
        if (state === "navigating" || state === "accepted") {
          setStatusText("전환 중…");
        }
        if (state === "rejected" || state === "error") {
          setStatusText(reason ? `실행 불가: ${reason}` : "실행 불가");
        }
        if (state === "done") {
          setStatusText(null);
        }
      });
    };

    setupSocket();

    return () => {
      mounted = false;
      if (socketRef.current) {
        socketRef.current.removeAllListeners();
        socketRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  // react-slick settings
  const settings = {
    dots: false,
    infinite: true,
    speed: 200,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: (current) => {
      setCurrentContent(current); // 슬라이드 변경 시 인덱스를 업데이트
      handleContentChange(current); // Socket을 통해 커버플로우와 동기화
    },
  };

  const resetInactivityTimer = () => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current); // 기존 타이머 제거
    }
    inactivityTimerRef.current = setTimeout(() => {
      if (statusRef.current === "Collect") {
        idleMode(); // 1분 동안 입력 없을 시 idleMode 실행
      }
    }, 60000); // 1분 (60,000ms)
  };

  const clearInactivityTimer = () => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
  };
  const handleUserInteraction = () => {
    if (statusRef.current === "Collect") {
      resetInactivityTimer(); // 사용자 입력 시 타이머 리셋
    }
  };
  useEffect(() => {
    if (statusRef.current === "Collect") {
      resetInactivityTimer(); // 상태가 Collect로 변경되면 타이머 시작

      // 사용자 입력 이벤트 감지
      window.addEventListener("touchstart", handleUserInteraction);
      window.addEventListener("mousedown", handleUserInteraction);

      return () => {
        // 이벤트 리스너 제거
        window.removeEventListener("touchstart", handleUserInteraction);
        window.removeEventListener("mousedown", handleUserInteraction);
        clearInactivityTimer(); // 상태 변경 시 타이머 클리어
      };
    }
  }, [status]);

  // Socket 이벤트를 통해 현재 콘텐츠 인덱스 전송
  const handleContentChange = (currentIndex) => {
    console.log(currentIndex);
    socketRef.current?.emit("highlightContent", currentIndex); // 현재 캐로셀의 인덱스를 서버에 전송
  };

  // 'next' 버튼을 누르면 캐로셀과 커버플로우 모두 다음으로 이동
  const handleNext = () => {
    socketRef.current?.emit("navigate", "next"); // 커버플로우에 'next' 이벤트 전송
  };

  // 'prev' 버튼을 누르면 캐로셀과 커버플로우 모두 이전으로 이동
  const handlePrev = () => {
    socketRef.current?.emit("navigate", "prev"); // 커버플로우에 'prev' 이벤트 전송
  };

  const Collect = () => {
    if (controlsLocked) return;
    socketRef.current?.emit("changePage", "collect");
    setStatus("Collect");
  };

  const idleMode = () => {
    if (controlsLocked) return;
    socketRef.current?.emit("changePage", "prevPage");
    setStatus("Idle");
    setSelected("");

    clearInactivityTimer(); // 비활성 타이머 클리어
  };

  const ReStage = () => {
    setStatus("Restage");
  };

  const reStageChunhee = () => {
    if (controlsLocked) return;
    socketRef.current?.emit("changePage", "reStageChunhee");
    setSelected("chunhee");
  };

  const reStageHodong = () => {
    if (controlsLocked) return;
    socketRef.current?.emit("changePage", "reStageHodong");
    setSelected("hodong");
  };

  return (
    <div className="controllerWrap">
      <div className={status === "Idle" ? "idle reveal" : "idle"}>
        <div onClick={controlsLocked ? undefined : ReStage}>
          <span>
            오페라
            <br />
            Re-Stage
          </span>
        </div>
        <div onClick={controlsLocked ? undefined : Collect}>
          <span>
            소장품
            <br /> 한 눈에 <br />
            살펴보기
          </span>
        </div>
      </div>
      <div className={status === "Restage" ? "restage reveal" : "restage"}>
        <span id="backBtn" onClick={idleMode}>
          <span className="material-symbols-outlined stop"> front_hand </span>{" "}
          대기 화면으로 돌아가기
        </span>
        <div
          onClick={controlsLocked ? undefined : reStageChunhee}
          className={selected === "chunhee" ? "nowon" : "default"}
        >
          1948 <br /> &lt;춘희&gt;
        </div>
        <div
          onClick={controlsLocked ? undefined : reStageHodong}
          className={selected === "hodong" ? "nowon" : "default"}
        >
          1962 <br /> &lt;왕자 호동&gt;
        </div>
      </div>

      {/* react-slick 캐로셀 */}
      <div
        className={status === "Collect" ? "collection reveal" : "collection"}
      >
        <div id="backBtn" onClick={idleMode}>
          <span className="material-symbols-outlined stop"> front_hand </span>{" "}
          대기 화면으로 돌아가기
        </div>
        <Slider {...settings} className="control">
          {collectData.map((collect, idx) => (
            <div className="slides_controller" key={idx}>
              <div>
                <p
                  dangerouslySetInnerHTML={{
                    __html:
                      collect.titleKo.replace(/, /g, ", <br/>") +
                      " " +
                      collect.type,
                  }}
                  className="collectionTitle"
                ></p>
                <p>연대: {collect.year}</p>
                <p>자료 크기: {collect.size}</p>
                <p>자료 수량: {collect.quantity}</p>
                <p>
                  자료 분량:{" "}
                  {collect.pageCount ? `${collect.pageCount}p` : "정보 없음"}
                </p>
                <p>{collect.donor} 기증</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}

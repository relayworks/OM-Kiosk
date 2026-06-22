"use client";
import HTMLFlipBook from "react-pageflip";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation"; // Next.js의 useRouter 사용

export default function Martha() {
  const totalPages = 24; // 총 페이지 수
  const [currentPage, setCurrentPage] = useState(0); // 현재 페이지를 관리
  const [isTimerActive, setIsTimerActive] = useState(false); // 타이머 작동 여부
  const [lastActivityTime, setLastActivityTime] = useState(Date.now()); // 마지막 입력 시간

  const flipBookRef = useRef(null); // flipBook 레퍼런스
  const router = useRouter(); // useRouter 훅 사용

  // 페이지가 변경될 때 호출되는 함수
  const handleFlip = (e) => {
    const page = e.data; // 현재 페이지 인덱스 (0부터 시작)
    setCurrentPage(page);

    setCurrentPage(page);
    setLastActivityTime(Date.now()); //
  };

  // 입력(페이지 넘기기)이 발생할 때 타이머를 초기화
  const handlePageTurn = () => {
    setLastActivityTime(Date.now()); // 마지막 입력 시간을 현재 시간으로 갱신
  };

  // 5분 동안 입력이 없을 경우 첫 페이지로 이동
  useEffect(() => {
    const checkInactivity = () => {
      const currentTime = Date.now();
      if (currentTime - lastActivityTime >= 300000) {
        // 5분(300,000ms) 경과
        if (flipBookRef.current) {
          flipBookRef.current.pageFlip().flip(0); // 첫 페이지로 이동
        }
      }
    };

    const interval = setInterval(checkInactivity, 1000); // 1초 간격으로 체크

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 타이머 정리
  }, [lastActivityTime]);

  // 마지막 페이지에 도달했을 때 60초 후 동일 경로로 리다이렉트 (새로고침)
  useEffect(() => {
    let timer;

    if (isTimerActive) {
      timer = setTimeout(() => {
        // 현재 경로를 명시적으로 새로고침
        window.location.href = window.location.href; // 현재 페이지로 리다이렉트
        setIsTimerActive(false); // 타이머 중지
      }, 120000); // 120초 타이머
    }

    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 정리
  }, [isTimerActive]);

  return (
    <div>
      <HTMLFlipBook
        width={614}
        height={850}
        showCover={true}
        ref={flipBookRef} // flipBook을 참조
        onFlip={handleFlip} // 페이지가 넘어갈 때 호출
      >
        {Array.from({ length: totalPages }, (_, index) => (
          <div className="demoPage" key={index}>
            <img
              src={`/Martha/${String(index + 1).padStart(2, "0")}.jpg`}
              alt={`Page ${index + 1}`}
              width="614"
              height="850"
            />
          </div>
        ))}
      </HTMLFlipBook>

      <button
        type="button"
        className="btn btn-info btn-sm btn-next"
        onClick={() => {
          if (flipBookRef.current) {
            flipBookRef.current.pageFlip().flipNext(); // 다음 페이지로 이동
            handlePageTurn(); // 입력 발생 처리
          }
        }}
      ></button>
      <button
        type="button"
        className="btn btn-info btn-sm btn-prev"
        onClick={() => {
          if (flipBookRef.current) {
            flipBookRef.current.pageFlip().flipPrev(); // 이전 페이지로 이동
            handlePageTurn(); // 입력 발생 처리
          }
        }}
      ></button>
    </div>
  );
}

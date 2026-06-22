"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Navigation from "../../components/navigation";
import HiddenExit from "../../components/hiddenExit";
export default function Layout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const inactivityTimerRef = useRef(null);

  useEffect(() => {
    // 타이머를 초기화하고 다시 설정하는 함수
    const resetInactivityTimer = () => {
      console.log("Resetting inactivity timer");

      // 기존 타이머를 해제
      clearTimeout(inactivityTimerRef.current);

      // 새로운 타이머를 설정
      inactivityTimerRef.current = setTimeout(() => {
        console.log("Navigating or refreshing...");
        if (pathname === "/IndividualArchive") {
          window.location.reload();
        } else {
          router.push("/IndividualArchive"); // /IndividualArchive로 이동
        }
      }, 60000); // 60초 후 실행
    };

    // 이벤트 리스너 등록
    window.addEventListener("touchstart", resetInactivityTimer);
    window.addEventListener("mousedown", resetInactivityTimer);

    // 초기 타이머 설정 (페이지 진입 시 바로 타이머 작동)
    resetInactivityTimer();

    // 클린업 함수: 이벤트 리스너 제거 및 타이머 해제
    return () => {
      window.removeEventListener("touchstart", resetInactivityTimer);
      window.removeEventListener("mousedown", resetInactivityTimer);
      clearTimeout(inactivityTimerRef.current);
    };
  }, [pathname, router]);

  return (
    <>
      <Navigation />
      <HiddenExit/>
      <header>인물 살펴보기</header>
      <main>{children}</main>
    </>
  );
}

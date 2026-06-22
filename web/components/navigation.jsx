"use client";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [isExiting, setIsExiting] = useState(false); // 애니메이션 상태

  const handleRouteChange = (e, path) => {
    e.preventDefault(); // Link 기본 동작 막기
    setIsExiting(true); // 애니메이션 시작
    setTimeout(() => {
      router.push(path); // 애니메이션 끝난 후 라우트 변경
      setIsExiting(false); // 애니메이션 완료 상태 초기화
    }, 700); // 애니메이션 시간과 맞춤 (700ms)
  };

  return (
    <nav className="headerWrapper">
      <Link
        href="/IndividualArchive"
        onClick={(e) => handleRouteChange(e, "/IndividualArchive")}
      >
        <div className={pathname === "/IndividualArchive" ? "active" : ""}>
          <ul>
            <img src="/fig_circle.png" alt="" />
          </ul>
          <ul>인물만 모아보기</ul>
        </div>
      </Link>

      <Link
        href="/IndividualArchive/pictureView"
        onClick={(e) => handleRouteChange(e, "/IndividualArchive/pictureView")}
      >
        <div
          className={
            pathname === "/IndividualArchive/pictureView" ? "active" : ""
          }
        >
          <ul>
            <img src="/imagesmode.png" alt="" />
          </ul>
          <ul>사진으로 모아보기</ul>
        </div>
      </Link>
    </nav>
  );
}

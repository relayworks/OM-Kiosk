"use client";
import { fetchContent, getFigureImage } from "../../lib/content-client";
import { useState, useEffect, useCallback, Suspense, lazy } from "react";

// moreInfo 컴포넌트를 lazy로 동적 로딩
// const MoreInfo = lazy(() => import("../components/MoreInfo"));

export default function pictureView() {
  const [showInfo, setShowInfo] = useState(false);
  const [selectIdx, setSelectIdx] = useState(0);
  const [selectOrgin, setSelectOrigin] = useState(0);
  const [figData, setFigData] = useState([]);
  const selectedItem = figData.find((item) => item.idx === selectIdx);

  useEffect(() => {
    fetchContent("figures")
      .then((data) => setFigData(data.items || []))
      .catch((error) => {
        console.warn("Failed to load figure content:", error);
      });
  }, []);

  const handleVisible = useCallback((idx, origin) => {
    setShowInfo(true);
    setSelectIdx(idx);
    document.body.style.overflow = "hidden";

    // 300ms 딜레이 후 setSelectOrigin 실행
    setTimeout(() => {
      setSelectOrigin(origin);
    }, 300); // 300ms 딜레이
  }, []);
  const handleInitialize = () => {
    setSelectOrigin(0);
    console.log("trigg");
    document.body.style.overflow = "unset";
    setTimeout(() => {
      setShowInfo(false);
      setSelectIdx(0);
    }, 300); // 300ms 딜레이
  };
  let isTicking = false;

  const handleScroll = () => {
    if (!isTicking) {
      window.requestAnimationFrame(() => {
        // Perform scroll-related operations
        isTicking = false;
      });
      isTicking = true;
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="imgWrap">
      <div className={showInfo ? "dimmer on" : "dimmer"}></div>

      <div
        className={
          selectOrgin === 1 ? "picture vertical selected" : "picture vertical"
        }
      >
        <img className="backgroundImage" src="/PIP/1948_1_1-3.jpg" alt="" />
        <div
          className={selectIdx == 3 ? "imgFig active" : "imgFig"}
          style={{
            left: `7%`,
            top: `7.25%`,
            backgroundImage: 'url("/PIP/1948_1_1-3.jpg")',
            backgroundPosition: "9.5% 8.75%",
            backgroundSize: "684%",
            width: `17%`,
            borderRadius: "100%",
            height: `12%`,
          }}
          onClick={() => handleVisible(3, 1)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">김자경</span>
        </div>
        <div
          className={selectIdx == 1 ? "imgFig active" : "imgFig"}
          style={{
            left: `44.95%`,
            top: `7.25%`,
            borderRadius: 0,
            backgroundImage: 'url("/PIP/1948_1_1-3.jpg")',
            backgroundPosition: "52% 9.25%",
            backgroundSize: "871%",
            width: `14%`,
            height: `12%`,
          }}
          onClick={() => handleVisible(1, 1)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">이인선</span>
        </div>
      </div>
      <div
        className={
          selectOrgin === 2 ? "picture vertical selected" : "picture vertical"
        }
      >
        <img className="backgroundImage" src="/PIP/1948_1_1-4.jpg" alt="" />
        <div
          className={selectIdx == 4 ? "imgFig active" : "imgFig"}
          style={{
            left: `7%`,
            top: `9.25%`,
            backgroundImage: 'url("/PIP/1948_1_1-4.jpg")',
            backgroundPosition: "9.5% 10.95%",
            backgroundSize: "867.6%",
            width: `15%`,
            borderRadius: "0%",
            height: `13%`,
          }}
          onClick={() => handleVisible(4, 2)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">옥인찬</span>
        </div>
      </div>

      <div
        className={
          selectOrgin === 3 ? "picture vertical selected" : "picture vertical"
        }
      >
        <img className="backgroundImage" src="/PIP/1950_1_1-2.jpg" alt="" />

        <div
          className={selectIdx == 6 ? "imgFig active" : "imgFig"}
          style={{
            left: `38%`,
            top: `6.25%`,
            backgroundImage: 'url("/PIP/1950_1_1-2.jpg")',
            backgroundPosition: "49.5% 8.95%",
            backgroundSize: "501%",
            width: `24%`,
            borderRadius: "100%",
            height: `16%`,
          }}
          onClick={() => handleVisible(6, 3)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">김복희</span>
        </div>
        <div
          className={selectIdx == 5 ? "imgFig active" : "imgFig"}
          style={{
            left: `12%`,
            top: `6.25%`,
            backgroundImage: 'url("/PIP/1950_1_1-2.jpg")',
            backgroundPosition: "17.5% 8.0%",
            backgroundSize: "490%",
            width: `24%`,
            borderRadius: "100%",
            height: `16%`,
          }}
          onClick={() => handleVisible(5, 3)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">김혜란</span>
        </div>
        <div
          className={selectIdx == 2 ? "imgFig active" : "imgFig"}
          style={{
            left: `20.5%`,
            top: `30.25%`,
            backgroundImage: 'url("/PIP/1950_1_1-2.jpg")',
            backgroundPosition: "28.80% 37.0%",
            backgroundSize: "501%",
            width: `24%`,
            borderRadius: "100%",
            height: `16%`,
          }}
          onClick={() => handleVisible(2, 3)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">임원식</span>
        </div>
        <div
          className={selectIdx == 7 ? "imgFig active" : "imgFig"}
          style={{
            left: `18%`,
            top: `54.25%`,
            backgroundImage: 'url("/PIP/1950_1_1-2.jpg")',
            backgroundPosition: "24.5% 65.75%",
            backgroundSize: "511%",
            width: `24%`,
            borderRadius: "100%",
            height: `16%`,
          }}
          onClick={() => handleVisible(7, 3)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">고종익</span>
        </div>
      </div>

      <div
        className={
          selectOrgin === 101 ? "picture horizon selected" : "picture horizon"
        }
      >
        <img className="backgroundImage" src="/PIP/1948_1_2.jpg" alt="" />

        <div
          className={selectIdx == 3 ? "imgFig active" : "imgFig"}
          style={{
            left: `58%`,
            top: `46.25%`,
            backgroundImage: 'url("/PIP/1948_1_2.jpg")',
            backgroundPosition: "62.45% 52.5%",
            backgroundSize: "1363%",
            width: `7%`,
            borderRadius: "100%",
            height: `12%`,
          }}
          onClick={() => handleVisible(3, 101)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">김자경</span>
        </div>

        <div
          className={selectIdx == 1 ? "imgFig active" : "imgFig"}
          style={{
            left: `38.95%`,
            top: `44.25%`,
            borderRadius: "100%",
            backgroundImage: 'url("/PIP/1948_1_2.jpg")',
            backgroundPosition: "41.85% 50.95%",
            backgroundSize: "1424%",
            width: `7%`,
            height: `12%`,
          }}
          onClick={() => handleVisible(1, 101)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">이인선</span>
        </div>

        <div
          className={selectIdx == 7 ? "imgFig active" : "imgFig"}
          style={{
            left: `77.95%`,
            top: `58.25%`,
            borderRadius: "100%",
            backgroundImage: 'url("/PIP/1948_1_2.jpg")',
            backgroundPosition: "83.2% 67%",
            backgroundSize: "1676%",
            width: `7%`,
            height: `12%`,
          }}
          onClick={() => handleVisible(7, 101)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">고종익</span>
        </div>
      </div>

      <div
        className={
          selectOrgin === 106 ? "picture horizon selected" : "picture horizon"
        }
      >
        <img className="backgroundImage" src="/PIP/1950_1_2.jpg" alt="" />
        <div
          className={selectIdx == 7 ? "imgFig active" : "imgFig"}
          style={{
            left: `28%`,
            top: `26.25%`,
            backgroundImage: 'url("/PIP/1950_1_2.jpg")',
            backgroundPosition: "31.25% 29%",
            backgroundSize: "914%",
            width: `9%`,
            borderRadius: "100%",
            height: `12%`,
          }}
          onClick={() => handleVisible(7, 106)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">고종익</span>
        </div>
      </div>
      <div
        className={
          selectOrgin === 107 ? "picture horizon selected" : "picture horizon"
        }
      >
        <img className="backgroundImage" src="/PIP/1950_1_4.jpg" alt="" />

        <div
          className={selectIdx == 5 ? "imgFig active" : "imgFig"}
          style={{
            left: `51.25%`,
            top: `15.75%`,
            backgroundImage: 'url("/PIP/1950_1_4.jpg")',
            backgroundPosition: "56.5% 18%",
            backgroundSize: "1114%",
            width: `9%`,
            borderRadius: "100%",
            height: `12%`,
          }}
          onClick={() => handleVisible(5, 107)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">김혜란</span>
        </div>
      </div>
      <div
        className={
          selectOrgin === 108 ? "picture horizon selected" : "picture horizon"
        }
      >
        <img className="backgroundImage" src="/PIP/1950_1_5.jpg" alt="" />
        <div
          className={selectIdx == 4 ? "imgFig active" : "imgFig"}
          style={{
            left: `71%`,
            top: `23.25%`,
            backgroundImage: 'url("/PIP/1950_1_5.jpg")',
            backgroundPosition: "81.5% 28%",
            backgroundSize: "734%",
            width: `12%`,
            borderRadius: "100%",
            height: `17%`,
          }}
          onClick={() => handleVisible(4, 108)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">옥인찬</span>
        </div>

        <div
          className={selectIdx == 5 ? "imgFig active" : "imgFig"}
          style={{
            left: `85.95%`,
            top: `26.25%`,
            borderRadius: "100%",
            backgroundImage: 'url("/PIP/1950_1_5.jpg")',
            backgroundPosition: "98.0% 32.5%",
            backgroundSize: "778%",
            width: `12%`,
            height: `17%`,
          }}
          onClick={() => handleVisible(5, 108)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">김혜란</span>
        </div>
      </div>
      <div
        className={
          selectOrgin === 109 ? "picture horizon selected" : "picture horizon"
        }
      >
        <img className="backgroundImage" src="/PIP/1950_1_6.jpg" alt="" />

        <div
          className={selectIdx == 18 ? "imgFig active" : "imgFig"}
          style={{
            left: `40%`,
            top: `38.25%`,
            backgroundImage: 'url("/PIP/1950_1_6.jpg")',
            backgroundPosition: "44.5% 44%",
            backgroundSize: "964%",
            width: `10%`,
            borderRadius: "100%",
            height: `13%`,
          }}
          onClick={() => handleVisible(18, 109)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">오현명</span>
        </div>

        <div
          className={selectIdx == 5 ? "imgFig active" : "imgFig"}
          style={{
            left: `51.95%`,
            top: `35.25%`,
            borderRadius: "100%",
            backgroundImage: 'url("/PIP/1950_1_6.jpg")',
            backgroundPosition: "58% 40.5%",
            backgroundSize: "964%",
            width: `10%`,
            height: `13%`,
          }}
          onClick={() => handleVisible(5, 109)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">김혜란</span>
        </div>
      </div>
      <div
        className={
          selectOrgin === 4 ? "picture vertical selected" : "picture vertical"
        }
      >
        <img
          className="backgroundImage"
          src="/PIP/1951_img20240809_10513926.jpg"
          alt=""
        />
        <div
          className={selectIdx == 8 ? "imgFig active" : "imgFig"}
          style={{
            left: `25%`,
            top: `9.75%`,
            backgroundImage: 'url("/PIP/1951_img20240809_10513926.jpg")',
            backgroundPosition: "50.5% 18.5%",
            backgroundSize: "233%",
            width: `50%`,
            borderRadius: "0%",
            height: `46.5%`,
          }}
          onClick={() => handleVisible(8, 4)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">현재명</span>
        </div>
      </div>

      <div
        className={
          selectOrgin === 5 ? "picture vertical selected" : "picture vertical"
        }
      >
        <img
          className="backgroundImage"
          src="/PIP/img20240809_10594231.jpg"
          alt=""
        />

        <div
          className={selectIdx == 14 ? "imgFig active" : "imgFig"}
          style={{
            left: `63%`,
            top: `13.25%`,
            backgroundImage: 'url("/PIP/img20240809_10594231.jpg")',
            backgroundPosition: "84.5% 19.5%",
            backgroundSize: "417%",
            width: `27%`,
            borderRadius: "0%",
            height: `27%`,
          }}
          onClick={() => handleVisible(14, 5)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">이진순</span>
        </div>
      </div>
      <div
        className={
          selectOrgin === 102 ? "picture horizon selected" : "picture horizon"
        }
      >
        <img className="backgroundImage" src="/PIP/1951_1_6.jpg" alt="" />

        <div
          className={selectIdx == 18 ? "imgFig active" : "imgFig"}
          style={{
            left: `24%`,
            top: `1.25%`,
            backgroundImage: 'url("/PIP/1951_1_6.jpg")',
            backgroundPosition: "28.5% 1.24%",
            backgroundSize: "588.8%",
            width: `17%`,
            borderRadius: "100%",
            height: `25%`,
          }}
          onClick={() => handleVisible(18, 102)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">오현명</span>
        </div>
        <div
          className={selectIdx == 31 ? "imgFig active" : "imgFig"}
          style={{
            left: `44.75%`,
            top: `1.25%`,
            backgroundImage: 'url("/PIP/1951_1_6.jpg")',
            backgroundPosition: "53.75% 1.24%",
            backgroundSize: "588.8%",
            width: `17%`,
            borderRadius: "100%",
            height: `25%`,
          }}
          onClick={() => handleVisible(31, 102)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">김학근</span>
        </div>

        <div
          className={selectIdx == 17 ? "imgFig active" : "imgFig"}
          style={{
            left: `68%`,
            top: `1.25%`,
            backgroundImage: 'url("/PIP/1951_1_6.jpg")',
            backgroundPosition: "82.25% 1.24%",
            backgroundSize: "588.8%",
            width: `17%`,
            borderRadius: "100%",
            height: `25%`,
          }}
          onClick={() => handleVisible(17, 102)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">이상춘</span>
        </div>
        <div
          className={selectIdx == 32 ? "imgFig active" : "imgFig"}
          style={{
            left: `23.75%`,
            top: `44.25%`,
            backgroundImage: 'url("/PIP/1951_1_6.jpg")',
            backgroundPosition: "27.5% 59.5%",
            backgroundSize: "588.8%",
            width: `17%`,
            borderRadius: "100%",
            height: `25%`,
          }}
          onClick={() => handleVisible(32, 102)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">김학상</span>
        </div>
        <div
          className={selectIdx == 5 ? "imgFig active" : "imgFig"}
          style={{
            left: `44.5%`,
            top: `48.25%`,
            backgroundImage: 'url("/PIP/1951_1_6.jpg")',
            backgroundPosition: "53.5% 65%",
            backgroundSize: "588.8%",
            width: `17%`,
            borderRadius: "100%",
            height: `25%`,
          }}
          onClick={() => handleVisible(5, 102)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">김혜란</span>
        </div>
        <div
          className={selectIdx == 11 ? "imgFig active" : "imgFig"}
          style={{
            left: `66%`,
            top: `50.25%`,
            backgroundImage: 'url("/PIP/1951_1_6.jpg")',
            backgroundPosition: "79.95% 68%",
            backgroundSize: "588.8%",
            width: `17%`,
            borderRadius: "100%",
            height: `25%`,
          }}
          onClick={() => handleVisible(11, 102)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">이관옥</span>
        </div>
      </div>

      <div
        className={
          selectOrgin === 103 ? "picture vertical selected" : "picture vertical"
        }
      >
        <img className="backgroundImage" src="/PIP/1951_1_3.jpg" alt="" />

        <div
          className={selectIdx == 11 ? "imgFig active" : "imgFig"}
          style={{
            left: `11%`,
            top: `17.25%`,
            backgroundImage: 'url("/PIP/1951_1_3.jpg")',
            backgroundPosition: "13.5% 20%",
            backgroundSize: "476%",
            width: `21%`,
            borderRadius: "100%",
            height: `13%`,
          }}
          onClick={() => handleVisible(11, 103)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">이관옥</span>
        </div>

        <div
          className={selectIdx == 5 ? "imgFig active" : "imgFig"}
          style={{
            left: `34%`,
            top: `18.25%`,
            backgroundImage: 'url("/PIP/1951_1_3.jpg")',
            backgroundPosition: "43.5% 22%",
            backgroundSize: "476%",
            width: `21%`,
            borderRadius: "100%",
            height: `13%`,
          }}
          onClick={() => handleVisible(5, 103)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">김혜란</span>
        </div>
        <div
          className={selectIdx == 17 ? "imgFig active" : "imgFig"}
          style={{
            left: `61%`,
            top: `9.25%`,
            backgroundImage: 'url("/PIP/1951_1_3.jpg")',
            backgroundPosition: "76.95% 11%",
            backgroundSize: "476%",
            width: `21%`,
            borderRadius: "100%",
            height: `13%`,
          }}
          onClick={() => handleVisible(17, 103)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">이상춘</span>
        </div>
      </div>
      <div
        className={
          selectOrgin === 104 ? "picture vertical selected" : "picture vertical"
        }
      >
        <img className="backgroundImage" src="/PIP/1951_1_5.jpg" alt="" />
        <div
          className={selectIdx == 11 ? "imgFig active" : "imgFig"}
          style={{
            left: `23%`,
            top: `10.25%`,
            backgroundImage: 'url("/PIP/1951_1_5.jpg")',
            backgroundPosition: "30.5% 13%",
            backgroundSize: "416%",
            width: `24%`,
            borderRadius: "100%",
            height: `17%`,
          }}
          onClick={() => handleVisible(11, 104)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">이관옥</span>
        </div>

        <div
          className={selectIdx == 5 ? "imgFig active" : "imgFig"}
          style={{
            left: `50%`,
            top: `15.25%`,
            backgroundImage: 'url("/PIP/1951_1_5.jpg")',
            backgroundPosition: "65.5% 19%",
            backgroundSize: "416%",
            width: `24%`,
            borderRadius: "100%",
            height: `17%`,
          }}
          onClick={() => handleVisible(5, 104)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">김혜란</span>
        </div>
      </div>
      <div
        className={
          selectOrgin === 105 ? "picture vertical selected" : "picture vertical"
        }
      >
        <img className="backgroundImage" src="/PIP/1951_1_4.jpg" alt="" />
        <div
          className={selectIdx == 5 ? "imgFig active" : "imgFig"}
          style={{
            left: `31%`,
            top: `19.25%`,
            backgroundImage: 'url("/PIP/1951_1_4.jpg")',
            backgroundPosition: "40.5% 22.5%",
            backgroundSize: "434.7%",
            width: `23%`,
            borderRadius: "100%",
            height: `13%`,
          }}
          onClick={() => handleVisible(5, 105)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">김혜란</span>
        </div>
      </div>
      <div
        className={
          selectOrgin === 6 ? "picture vertical selected" : "picture vertical"
        }
      >
        <img className="backgroundImage" src="/PIP/1954_01_0013.jpg" alt="" />
        <div
          className={selectIdx == 16 ? "imgFig active" : "imgFig"}
          style={{
            left: `71%`,
            top: `10.25%`,
            backgroundImage: 'url("/PIP/1954_01_0013.jpg")',
            backgroundPosition: "87.5% 14.5%",
            backgroundSize: "567%",
            width: `20%`,
            borderRadius: "0%",
            height: `19%`,
          }}
          onClick={() => handleVisible(16, 6)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">이해랑</span>
        </div>
      </div>
      <div
        className={
          selectOrgin === 7 ? "picture vertical selected" : "picture vertical"
        }
      >
        <img className="backgroundImage" src="/PIP/1954_01_0014.jpg" alt="" />
        <div
          className={selectIdx == 17 ? "imgFig active" : "imgFig"}
          style={{
            left: `71%`,
            top: `9.25%`,
            backgroundImage: 'url("/PIP/1954_01_0014.jpg")',
            backgroundPosition: "88.5% 12.95%",
            backgroundSize: "551%",
            width: `21%`,
            borderRadius: "0%",
            height: `20%`,
          }}
          onClick={() => handleVisible(17, 7)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">이상춘</span>
        </div>

        <div
          className={selectIdx == 15 ? "imgFig active" : "imgFig"}
          style={{
            left: `8%`,
            top: `54.25%`,
            backgroundImage: 'url("/PIP/1954_01_0014.jpg")',
            backgroundPosition: "11.5% 67.5%",
            backgroundSize: "560%",
            width: `21%`,
            borderRadius: "0%",
            height: `20%`,
          }}
          onClick={() => handleVisible(15, 7)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">임만섭</span>
        </div>
      </div>

      <div
        className={
          selectOrgin === 8 ? "picture vertical selected" : "picture vertical"
        }
      >
        <img className="backgroundImage" src="/PIP/1954_01_0015.jpg" alt="" />

        <div
          className={selectIdx == 33 ? "imgFig active" : "imgFig"}
          style={{
            left: `7%`,
            top: `10.5%`,
            backgroundImage: 'url("/PIP/1954_01_0015.jpg")',
            backgroundPosition: "9.95% 14.25%",
            backgroundSize: "570%",
            width: `21%`,
            borderRadius: "0%",
            height: `20%`,
          }}
          onClick={() => handleVisible(33, 8)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">이경숙</span>
        </div>
      </div>
      <div
        className={
          selectOrgin === 9 ? "picture vertical selected" : "picture vertical"
        }
      >
        <img className="backgroundImage" src="/PIP/1958_01_0007.jpg" alt="" />

        <div
          className={selectIdx == 32 ? "imgFig active" : "imgFig"}
          style={{
            left: `42%`,
            top: `61.25%`,
            backgroundImage: 'url("/PIP/1958_01_0007.jpg")',
            backgroundPosition: "54.5% 72.5%",
            backgroundSize: "501%",
            width: `23%`,
            borderRadius: "0%",
            height: `16.5%`,
          }}
          onClick={() => handleVisible(32, 9)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">김학상</span>
        </div>
        <div
          className={selectIdx == 50 ? "imgFig active" : "imgFig"}
          style={{
            left: `68%`,
            top: `61.25%`,
            backgroundImage: 'url("/PIP/1958_01_0007.jpg")',
            backgroundPosition: "87.5% 73.5%",
            backgroundSize: "501%",
            width: `23%`,
            borderRadius: "0%",
            height: `16.5%`,
          }}
          onClick={() => handleVisible(50, 9)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">이남수</span>
        </div>
      </div>
      <div
        className={
          selectOrgin === 10 ? "picture vertical selected" : "picture vertical"
        }
      >
        <img className="backgroundImage" src="/PIP/1958_01_0008.jpg" alt="" />

        <div
          className={selectIdx == 21 ? "imgFig active" : "imgFig"}
          style={{
            left: `11.25%`,
            top: `14.25%`,
            backgroundImage: 'url("/PIP/1958_01_0008.jpg")',
            backgroundPosition: "16% 18.2%",
            backgroundSize: "505%",
            width: `23%`,
            borderRadius: "0%",
            height: `17.05%`,
          }}
          onClick={() => handleVisible(21, 10)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">안형일</span>
        </div>

        <div
          className={selectIdx == 19 ? "imgFig active" : "imgFig"}
          style={{
            left: `68%`,
            top: `14.5%`,
            backgroundImage: 'url("/PIP/1958_01_0008.jpg")',
            backgroundPosition: "87.5% 17.95%",
            backgroundSize: "495%",
            width: `22.5%`,
            borderRadius: "0%",
            height: `16.5%`,
          }}
          onClick={() => handleVisible(19, 10)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">양천종</span>
        </div>

        <div
          className={selectIdx == 18 ? "imgFig active" : "imgFig"}
          style={{
            left: `11%`,
            top: `52.75%`,
            backgroundImage: 'url("/PIP/1958_01_0008.jpg")',
            backgroundPosition: "15.5% 63.75%",
            backgroundSize: "499%",
            width: `23%`,
            borderRadius: "0%",
            height: `17.05%`,
          }}
          onClick={() => handleVisible(18, 10)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">오현명</span>
        </div>
        <div
          className={selectIdx == 20 ? "imgFig active" : "imgFig"}
          style={{
            left: `68%`,
            top: `52.75%`,
            backgroundImage: 'url("/PIP/1958_01_0008.jpg")',
            backgroundPosition: "87.5% 63.75%",
            backgroundSize: "495%",
            width: `23%`,
            borderRadius: "0%",
            height: `17.05%`,
          }}
          onClick={() => handleVisible(20, 10)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">홍진표</span>
        </div>
        <div
          className={selectIdx == 50 ? "imgFig active" : "imgFig"}
          style={{
            left: `40%`,
            top: `53.25%`,
            backgroundImage: 'url("/PIP/1958_01_0008.jpg")',
            backgroundPosition: "51.25% 63.75%",
            backgroundSize: "505%",
            width: `23%`,
            borderRadius: "0%",
            height: `17.05%`,
          }}
          onClick={() => handleVisible(50, 10)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">장혜경</span>
        </div>
      </div>
      <div
        className={
          selectOrgin === 11 ? "picture vertical selected" : "picture vertical"
        }
      >
        <img className="backgroundImage" src="/PIP/1958_02_0011.jpg" alt="" />
        <div
          className={selectIdx == 24 ? "imgFig active" : "imgFig"}
          style={{
            left: "6%",
            top: "6.25%",
            backgroundImage: 'url("/PIP/1958_02_0011.jpg")',
            backgroundPosition: "84.5% 30.7%",
            backgroundSize: "421%",
            width: `25%`,
            borderRadius: "0%",
            height: `24%`,
          }}
          onClick={() => handleVisible(24, 11)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">오화섭</span>
        </div>

        <div
          className={selectIdx == 48 ? "imgFig active" : "imgFig"}
          style={{
            left: `6%`,
            top: `6.25%`,
            backgroundImage: 'url("/PIP/1958_02_0011.jpg")',
            backgroundPosition: "12.5% 11.7%",
            backgroundSize: "266%",
            width: `41%`,
            borderRadius: "0%",
            height: `41%`,
          }}
          onClick={() => handleVisible(48, 11)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">장종선</span>
        </div>
      </div>
      <div
        className={
          selectOrgin === 12 ? "picture vertical selected" : "picture vertical"
        }
      >
        <img className="backgroundImage" src="/PIP/1958_02_0012.jpg" alt="" />
        <div
          className={selectIdx == 23 ? "imgFig active" : "imgFig"}
          style={{
            left: `13%`,
            top: `6.25%`,
            backgroundImage: 'url("/PIP/1958_02_0012.jpg")',
            backgroundPosition: "22.5% 7.7%",
            backgroundSize: "282%",
            width: `38%`,
            borderRadius: "0%",
            height: `25%`,
          }}
          onClick={() => handleVisible(23, 12)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">김생려</span>
        </div>
      </div>
      <div
        className={
          selectOrgin === 13 ? "picture vertical selected" : "picture vertical"
        }
      >
        <img className="backgroundImage" src="/PIP/1958_02_0014.jpg" alt="" />
        <div
          className={selectIdx == 10 ? "imgFig active" : "imgFig"}
          style={{
            left: `12%`,
            top: `6.25%`,
            backgroundImage: 'url("/PIP/1958_02_0014.jpg")',
            backgroundPosition: "25.5% 13.25%",
            backgroundSize: "214%",
            width: `51%`,
            borderRadius: "0%",
            height: `43%`,
          }}
          onClick={() => handleVisible(10, 13)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">이인범</span>
        </div>
      </div>
      <div
        className={
          selectOrgin === 14 ? "picture vertical selected" : "picture vertical"
        }
      >
        <img className="backgroundImage" src="/PIP/1958_02_0015.jpg" alt="" />

        <div
          className={selectIdx == 25 ? "imgFig active" : "imgFig"}
          style={{
            left: `11.5%`,
            top: `37.25%`,
            backgroundImage: 'url("/PIP/1958_02_0015.jpg")',
            backgroundPosition: "18.5% 75.5%",
            backgroundSize: "340%",
            width: `32.75%`,
            borderRadius: "0%",
            height: `49%`,
          }}
          onClick={() => handleVisible(25, 14)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">채리숙</span>
        </div>
      </div>
      <div
        className={
          selectOrgin === 15 ? "picture vertical selected" : "picture vertical"
        }
      >
        <img className="backgroundImage" src="/PIP/1958_02_0016.jpg" alt="" />

        <div
          className={selectIdx == 22 ? "imgFig active" : "imgFig"}
          style={{
            left: `14%`,
            top: `7.25%`,
            backgroundImage: 'url("/PIP/1958_02_0016.jpg")',
            backgroundPosition: "24.5% 12.5%",
            backgroundSize: "273%",
            width: `39%`,
            borderRadius: "0%",
            height: `38%`,
          }}
          onClick={() => handleVisible(22, 15)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">황병덕</span>
        </div>
      </div>

      <div
        className={
          selectOrgin === 16 ? "picture vertical selected" : "picture vertical"
        }
      >
        <img className="backgroundImage" src="/PIP/1959_01_0017.jpg" alt="" />
        <div
          className={selectIdx == 46 ? "imgFig active" : "imgFig"}
          style={{
            left: `8%`,
            top: `2.15%`,
            backgroundImage: 'url("/PIP/1959_01_0017.jpg")',
            backgroundPosition: "13.5% 3.75%",
            backgroundSize: "360%",
            width: `31%`,
            borderRadius: "0%",
            height: `22%`,
          }}
          onClick={() => handleVisible(46, 16)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">홍연택</span>
        </div>
      </div>
      <div
        className={
          selectOrgin === 17 ? "picture vertical selected" : "picture vertical"
        }
      >
        <img className="backgroundImage" src="/PIP/1959_01_0021.jpg" alt="" />

        <div
          className={selectIdx == 30 ? "imgFig active" : "imgFig"}
          style={{
            left: `54.5%`,
            top: `54.5%`,
            backgroundImage: 'url("/PIP/1959_01_0021.jpg")',
            backgroundPosition: "82.5% 83.5%",
            backgroundSize: "315%",
            width: `35%`,
            borderRadius: "0%",
            height: `34%`,
          }}
          onClick={() => handleVisible(30, 17)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">엄경원</span>
        </div>
      </div>
      <div
        className={
          selectOrgin === 18 ? "picture vertical selected" : "picture vertical"
        }
      >
        <img className="backgroundImage" src="/PIP/1959_01_0022.jpg" alt="" />
        <div
          className={selectIdx == 31 ? "imgFig active" : "imgFig"}
          style={{
            left: `9%`,
            top: `11.25%`,
            backgroundImage: 'url("/PIP/1959_01_0022.jpg")',
            backgroundPosition: "18.5% 19.5%",
            backgroundSize: "258%",
            width: `43%`,
            borderRadius: "0%",
            height: `37.5%`,
          }}
          onClick={() => handleVisible(31, 18)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">김학근</span>
        </div>
      </div>
      <div
        className={
          selectOrgin === 110 ? "picture horizon selected" : "picture horizon"
        }
      >
        <img className="backgroundImage" src="/PIP/1959_2_1.jpg" alt="" />

        <div
          className={selectIdx == 33 ? "imgFig active" : "imgFig"}
          style={{
            left: `29.5%`,
            top: `41.25%`,
            backgroundImage: 'url("/PIP/1959_2_1.jpg")',
            backgroundPosition: "31.5% 47%",
            backgroundSize: "1428%",
            width: `7%`,
            borderRadius: "100%",
            height: `10%`,
          }}
          onClick={() => handleVisible(33, 110)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">이경숙</span>
        </div>

        <div
          className={selectIdx == 21 ? "imgFig active" : "imgFig"}
          style={{
            left: `35.95%`,
            top: `41.25%`,
            borderRadius: "100%",
            backgroundImage: 'url("/PIP/1959_2_1.jpg")',
            backgroundPosition: "38.75% 46.5%",
            backgroundSize: "1428%",
            width: `7%`,
            height: `10%`,
          }}
          onClick={() => handleVisible(21, 110)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">안형일</span>
        </div>
        <div
          className={selectIdx == 45 ? "imgFig active" : "imgFig"}
          style={{
            left: `52.95%`,
            top: `36.25%`,
            borderRadius: "100%",
            backgroundImage: 'url("/PIP/1959_2_1.jpg")',
            backgroundPosition: "57% 40.5%",
            backgroundSize: "1428%",
            width: `7%`,
            height: `10%`,
          }}
          onClick={() => handleVisible(45, 110)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">고형주</span>
        </div>
        <div
          className={selectIdx == 18 ? "imgFig active" : "imgFig"}
          style={{
            left: `70.55%`,
            top: `37.25%`,
            borderRadius: "100%",
            backgroundImage: 'url("/PIP/1959_2_1.jpg")',
            backgroundPosition: "76% 40.5%",
            backgroundSize: "1428%",
            width: `7%`,
            height: `10%`,
          }}
          onClick={() => handleVisible(18, 110)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">오현명</span>
        </div>
      </div>
      <div
        className={
          selectOrgin === 111 ? "picture horizon selected" : "picture horizon"
        }
      >
        <img className="backgroundImage" src="/PIP/1959_2_2.jpg" alt="" />

        <div
          className={selectIdx == 21 ? "imgFig active" : "imgFig"}
          style={{
            left: `23%`,
            top: `16.25%`,
            backgroundImage: 'url("/PIP/1959_2_2.jpg")',
            backgroundPosition: "28.85% 23.4%",
            backgroundSize: "530%",
            width: `20%`,
            borderRadius: "100%",
            height: `30%`,
          }}
          onClick={() => handleVisible(21, 111)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">안형일</span>
        </div>

        <div
          className={selectIdx == 34 ? "imgFig active" : "imgFig"}
          style={{
            left: `45.95%`,
            top: `23.25%`,

            backgroundImage: 'url("/PIP/1959_2_2.jpg")',
            backgroundPosition: "57.5% 33%",
            backgroundSize: "530%",
            width: `20%`,
            borderRadius: "100%",
            height: `30%`,
          }}
          onClick={() => handleVisible(34, 111)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">장혜경</span>
        </div>

        <div
          className={selectIdx == 45 ? "imgFig active" : "imgFig"}
          style={{
            left: `63%`,
            top: `17.25%`,
            backgroundImage: 'url("/PIP/1959_2_2.jpg")',
            backgroundPosition: "78.5% 24.795%",
            backgroundSize: "530%",
            width: `20%`,
            borderRadius: "100%",
            height: `30%`,
          }}
          onClick={() => handleVisible(45, 111)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">고형주</span>
        </div>
      </div>

      <div
        className={
          selectOrgin === 112 ? "picture horizon selected" : "picture horizon"
        }
      >
        <img className="backgroundImage" src="/PIP/1960_2_2.jpg" alt="" />

        <div
          className={selectIdx == 45 ? "imgFig active" : "imgFig"}
          style={{
            left: `32%`,
            top: `26.25%`,
            backgroundImage: 'url("/PIP/1960_2_2.jpg")',
            backgroundPosition: "36.5% 35%",
            backgroundSize: "666.67%",
            width: `15%`,
            borderRadius: "100%",
            height: `19%`,
          }}
          onClick={() => handleVisible(45, 112)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">고형주</span>
        </div>
      </div>
      <div
        className={
          selectOrgin === 19 ? "picture vertical selected" : "picture vertical"
        }
      >
        <img className="backgroundImage" src="/PIP/1960_03_0003.jpg" alt="" />

        <div
          className={selectIdx == 38 ? "imgFig active" : "imgFig"}
          style={{
            left: `3%`,
            top: `2.75%`,
            backgroundImage: 'url("/PIP/1960_03_0003.jpg")',
            backgroundPosition: "5.5% 4.5%",
            backgroundSize: "351%",
            width: `31%`,
            borderRadius: "0%",
            height: `24%`,
          }}
          onClick={() => handleVisible(38, 19)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">김희조</span>
        </div>
        <div
          className={selectIdx == 39 ? "imgFig active" : "imgFig"}
          style={{
            left: `2%`,
            top: `66.25%`,
            backgroundImage: 'url("/PIP/1960_03_0003.jpg")',
            backgroundPosition: "5.5% 88.0%",
            backgroundSize: "349%",
            width: `32%`,
            borderRadius: "0%",
            height: `24.5%`,
          }}
          onClick={() => handleVisible(39, 19)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">호진옥</span>
        </div>
      </div>

      <div
        className={
          selectOrgin === 20 ? "picture vertical selected" : "picture vertical"
        }
      >
        <img className="backgroundImage" src="/PIP/1960_03_0004.jpg" alt="" />

        <div
          className={selectIdx == 28 ? "imgFig active" : "imgFig"}
          style={{
            left: `7%`,
            top: `2.5%`,
            backgroundImage: 'url("/PIP/1960_03_0004.jpg")',
            backgroundPosition: "11.5% 3.95%",
            backgroundSize: "361%",
            width: `30%`,
            borderRadius: "0%",
            height: `24%`,
          }}
          onClick={() => handleVisible(28, 20)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">김금환</span>
        </div>

        <div
          className={selectIdx == 41 ? "imgFig active" : "imgFig"}
          style={{
            left: `35.75%`,
            top: `34%`,
            backgroundImage: 'url("/PIP/1960_03_0004.jpg")',
            backgroundPosition: "51.5% 45.5%",
            backgroundSize: "370%",
            width: `30%`,
            borderRadius: "0%",
            height: `24%`,
          }}
          onClick={() => handleVisible(41, 20)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">윤을병</span>
        </div>

        <div
          className={selectIdx == 37 ? "imgFig active" : "imgFig"}
          style={{
            left: `64%`,
            top: `65.75%`,
            backgroundImage: 'url("/PIP/1960_03_0004.jpg")',
            backgroundPosition: "91.95% 87.5%",
            backgroundSize: "361%",
            width: `32%`,
            borderRadius: "0%",
            height: `24.5%`,
          }}
          onClick={() => handleVisible(37, 20)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">서영모</span>
        </div>
      </div>
      <div
        className={
          selectOrgin === 21 ? "picture vertical selected" : "picture vertical"
        }
      >
        <img className="backgroundImage" src="/PIP/1960_03_0005.jpg" alt="" />
        <div
          className={selectIdx == 40 ? "imgFig active" : "imgFig"}
          style={{
            left: `6%`,
            top: `3.25%`,
            backgroundImage: 'url("/PIP/1960_03_0005.jpg")',
            backgroundPosition: "9.5% 4.5%",
            backgroundSize: "363.34%",
            width: `30%`,
            borderRadius: "0%",
            height: `23.5%`,
          }}
          onClick={() => handleVisible(40, 21)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">김노현</span>
        </div>
      </div>
      <div
        className={
          selectOrgin === 22 ? "picture vertical selected" : "picture vertical"
        }
      >
        <img className="backgroundImage" src="/PIP/1962_02_0004.jpg" alt="" />

        <div
          className={selectIdx == 27 ? "imgFig active" : "imgFig"}
          style={{
            left: `8%`,
            top: `47.25%`,
            backgroundImage: 'url("/PIP/1962_02_0004.jpg")',
            backgroundPosition: "13.5% 80.5%",
            backgroundSize: "319%",
            width: `36%`,
            borderRadius: "0%",
            height: `40%`,
          }}
          onClick={() => handleVisible(27, 22)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">현종건</span>
        </div>
      </div>
      <div
        className={
          selectOrgin === 23 ? "picture vertical selected" : "picture vertical"
        }
      >
        <img className="backgroundImage" src="/PIP/1962_02_0005.jpg" alt="" />

        <div
          className={selectIdx == 29 ? "imgFig active" : "imgFig"}
          style={{
            left: `10%`,
            top: `8.75%`,
            backgroundImage: 'url("/PIP/1962_02_0005.jpg")',
            backgroundPosition: "15.5% 15.5%",
            backgroundSize: "400%",
            width: `28.5%`,
            borderRadius: "0%",
            height: `36.5%`,
          }}
          onClick={() => handleVisible(29, 23)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">최현민</span>
        </div>
      </div>
      <div
        className={
          selectOrgin === 24 ? "picture vertical selected" : "picture vertical"
        }
      >
        <img className="backgroundImage" src="/PIP/1962_02_0006.jpg" alt="" />
        <div
          className={selectIdx == 42 ? "imgFig active" : "imgFig"}
          style={{
            left: `72%`,
            top: `1.25%`,
            backgroundImage: 'url("/PIP/1962_02_0006.jpg")',
            backgroundPosition: "99.5% 1.5%",
            backgroundSize: "391%",
            width: `28%`,
            borderRadius: "100%",
            height: `29%`,
          }}
          onClick={() => handleVisible(42, 24)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">김옥자</span>
        </div>

        <div
          className={selectIdx == 26 ? "imgFig active" : "imgFig"}
          style={{
            left: `43%`,
            top: `49.0%`,
            backgroundImage: 'url("/PIP/1962_02_0006.jpg")',
            backgroundPosition: "59.5% 70.5%",
            backgroundSize: "391%",
            width: `28%`,
            borderRadius: "100%",
            height: `29%`,
          }}
          onClick={() => handleVisible(26, 24)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">한경진</span>
        </div>

        <div
          className={selectIdx == 43 ? "imgFig active" : "imgFig"}
          style={{
            left: `1%`,
            top: `63.25%`,
            backgroundImage: 'url("/PIP/1962_02_0006.jpg")',
            backgroundPosition: "3.5% 90.5%",
            backgroundSize: "391%",
            width: `28%`,
            borderRadius: "100%",
            height: `29%`,
          }}
          onClick={() => handleVisible(43, 24)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">신인철</span>
        </div>
      </div>
      <div
        className={
          selectOrgin === 25 ? "picture vertical selected" : "picture vertical"
        }
      >
        <img className="backgroundImage" src="/PIP/1962_02_0007.jpg" alt="" />

        <div
          className={selectIdx == 45 ? "imgFig active" : "imgFig"}
          style={{
            left: `74%`,
            top: `10.25%`,
            backgroundImage: 'url("/PIP/1962_02_0007.jpg")',
            backgroundPosition: "98.5% 15.75%",
            backgroundSize: "430%",
            width: `26%`,
            borderRadius: "100%",
            height: `27%`,
          }}
          onClick={() => handleVisible(45, 25)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">고형주</span>
        </div>

        <div
          className={selectIdx == 44 ? "imgFig active" : "imgFig"}
          style={{
            left: `50%`,
            top: `65.25%`,
            backgroundImage: 'url("/PIP/1962_02_0007.jpg")',
            backgroundPosition: "67.5% 91.5%",
            backgroundSize: "391%",
            width: `26%`,
            borderRadius: "100%",
            height: `27%`,
          }}
          onClick={() => handleVisible(44, 25)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">변성엽</span>
        </div>
      </div>
      <div
        className={
          selectOrgin === 26 ? "picture vertical selected" : "picture vertical"
        }
      >
        <img className="backgroundImage" src="/PIP/1962_01_0003.jpg" alt="" />

        <div
          className={selectIdx == 52 ? "imgFig active" : "imgFig"}
          style={{
            left: `15%`,
            top: `10.25%`,
            backgroundImage: 'url("/PIP/1962_01_0003.jpg")',
            backgroundPosition: "23.5% 15.5%",
            backgroundSize: "331%",
            width: `34%`,
            borderRadius: "0%",
            height: `31%`,
          }}
          onClick={() => handleVisible(52, 26)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">Manfred Gurlitt</span>
        </div>

        <div
          className={selectIdx == 53 ? "imgFig active" : "imgFig"}
          style={{
            left: `55.5%`,
            top: `9.25%`,
            backgroundImage: 'url("/PIP/1962_01_0003.jpg")',
            backgroundPosition: "81.5% 16.25%",
            backgroundSize: "361%",
            width: `32.25%`,
            borderRadius: "70%",
            height: `31%`,
          }}
          onClick={() => handleVisible(53, 26)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">Gerhard Hüsch</span>
        </div>
      </div>

      <div
        className={
          selectOrgin === 27 ? "picture vertical selected" : "picture vertical"
        }
      >
        <img className="backgroundImage" src="/PIP/1962_01_0004.jpg" alt="" />

        <div
          className={selectIdx == 54 ? "imgFig active" : "imgFig"}
          style={{
            left: `9.5%`,
            top: `66.75%`,
            backgroundImage: 'url("/PIP/1962_01_0004.jpg")',
            backgroundPosition: "14.5% 86.5%",
            backgroundSize: "446%",
            width: `25.2%`,
            borderRadius: "0%",
            height: `22.5%`,
          }}
          onClick={() => handleVisible(54, 27)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">Christel Goltz</span>
        </div>

        <div
          className={selectIdx == 55 ? "imgFig active" : "imgFig"}
          style={{
            left: `66.5%`,
            top: `66.75%`,
            backgroundImage: 'url("/PIP/1962_01_0004.jpg")',
            backgroundPosition: "87.5% 86.5%",
            backgroundSize: "462%",
            width: `25%`,
            borderRadius: "0%",
            height: `23%`,
          }}
          onClick={() => handleVisible(55, 27)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">Fritz Uhl</span>
        </div>

        <div
          className={selectIdx == 56 ? "imgFig active" : "imgFig"}
          style={{
            left: `38%`,
            top: `66.75%`,
            backgroundImage: 'url("/PIP/1962_01_0004.jpg")',
            backgroundPosition: "50.5% 86.5%",
            backgroundSize: "455%",
            width: `25%`,
            borderRadius: "0%",
            height: `23%`,
          }}
          onClick={() => handleVisible(56, 27)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">Josef Metternich</span>
        </div>
      </div>
      <div
        className={
          selectOrgin === 28 ? "picture vertical selected" : "picture vertical"
        }
      >
        <img className="backgroundImage" src="/PIP/1962_01_0005.jpg" alt="" />
        <div
          className={selectIdx == 35 ? "imgFig active" : "imgFig"}
          style={{
            left: `38%`,
            top: `65.25%`,
            backgroundImage: 'url("/PIP/1962_01_0005.jpg")',
            backgroundPosition: "50.5% 84.5%",
            backgroundSize: "472%",
            width: `24.75%`,
            borderRadius: "0%",
            height: `22.5%`,
          }}
          onClick={() => handleVisible(35, 28)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">이우근</span>
        </div>

        <div
          className={selectIdx == 36 ? "imgFig active" : "imgFig"}
          style={{
            left: `67.5%`,
            top: `65.25%`,
            backgroundImage: 'url("/PIP/1962_01_0005.jpg")',
            backgroundPosition: "88.5% 84.5%",
            backgroundSize: "450%",
            width: `24.75%`,
            borderRadius: "0%",
            height: `22.5%`,
          }}
          onClick={() => handleVisible(36, 28)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">이인영</span>
        </div>
      </div>

      <div
        className={
          selectOrgin === 29 ? "picture vertical selected" : "picture vertical"
        }
      >
        <img className="backgroundImage" src="/PIP/1962_0_1.jpg" alt="" />
        <div
          className={selectIdx == 49 ? "imgFig active" : "imgFig"}
          style={{
            left: `11%`,
            top: `9.25%`,
            backgroundImage: 'url("/PIP/1962_0_1.jpg")',
            backgroundPosition: "16% 13.25%",
            backgroundSize: "472%",
            width: `24.75%`,
            borderRadius: "0%",
            height: `26.5%`,
          }}
          onClick={() => handleVisible(49, 29)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">장일남</span>
        </div>
        <div
          className={selectIdx == 50 ? "imgFig active" : "imgFig"}
          style={{
            left: `10.5%`,
            top: `65.25%`,
            backgroundImage: 'url("/PIP/1962_0_1.jpg")',
            backgroundPosition: "17.5% 81.5%",
            backgroundSize: "530%",
            width: `23.75%`,
            borderRadius: "0%",
            height: `19.5%`,
          }}
          onClick={() => handleVisible(50, 29)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">이남수</span>
        </div>
      </div>

      <div
        className={
          selectOrgin === 30 ? "picture vertical selected" : "picture vertical"
        }
      >
        <img className="backgroundImage" src="/PIP/1962_0_2.jpg" alt="" />

        <div
          className={selectIdx == 51 ? "imgFig active" : "imgFig"}
          style={{
            left: `8%`,
            top: `32.75%`,
            backgroundImage: 'url("/PIP/1962_0_2.jpg")',
            backgroundPosition: "12.75% 42.5%",
            backgroundSize: "538%",
            width: `22.75%`,
            borderRadius: "0%",
            height: `21%`,
          }}
          onClick={() => handleVisible(51, 30)} // 함수 호출을 감싼다.
        >
          <span className="nameTag">황영금</span>
        </div>
      </div>

      <div className={showInfo ? "moreInfo on" : "moreInfo"}>
        {selectedItem && (
          <div className="infoThumb">
            <img src={getFigureImage(selectedItem)} alt="" />
          </div>
        )}
        {selectedItem && (
          <span className="infoName">
            {" "}
            {selectedItem.name + "(" + selectedItem.Year + ")"}
          </span>
        )}
        {selectedItem && (
          <ul>
            {selectedItem.Desc.split("\n").map((desc, index) => (
              <li key={index}>{desc}</li> // '\n'을 기준으로 나눈 후 <li>로 감싼다
            ))}
          </ul>
        )}

        <div className="closeBtn" onClick={() => handleInitialize()}>
          {" "}
          {/* 함수 호출을 감싼다 */}
        </div>
      </div>
    </div>
  );
}

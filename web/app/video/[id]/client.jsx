"use client";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import ReactPlayer from "react-player";
import { fetchContent } from "../../lib/content-client";

const VideoPlayer = ({ id }) => {
  const [videoUrl, setVideoUrl] = useState(null);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const playerRef = useRef(null);
  const videoId = useParams().id;
  const router = useRouter(); // useRouter 인스턴스 생성
console.log("VideoPlayer id:", id);
  const togglePlayPause = () => {
    setPlaying((prev) => !prev);
  };

  const handleProgress = ({ playedSeconds }) => {
    setProgress(playedSeconds);
  };
  const handleEnd = () => {
    router.push("/video"); // 비디오 재생이 완료되면 /video로 라우팅
  };

  const handleSeek = (newTime) => {
    if (playerRef.current) {
      playerRef.current.seekTo(newTime, "seconds");
      setProgress(newTime);
    }
  };

  const handleDuration = (duration) => {
    setDuration(duration);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  useEffect(() => {
    fetchContent("videos")
      .then((data) => {
        const video = (data.sections || [])
          .flatMap((section) => section.videos || [])
          .find((item) => String(item.id) === String(videoId));
        setVideoUrl(video?.video || `/media/video/${videoId}.mp4`);
      })
      .catch((error) => {
        console.warn("Failed to load video content:", error);
        setVideoUrl(`/media/video/${videoId}.mp4`);
      });
  }, [id, videoId]);

  if (!videoUrl) {
    return <p>Loading...</p>;
  }

  const progressPercentage = duration ? (progress / duration) * 100 : 0;

  return (
    <>
      <div className="video-player-wrapper">
        <ReactPlayer
          url={videoUrl}
          playing={playing}
          ref={playerRef}
          controls={false}
          width="100%"
          height="100dvh"
          onProgress={handleProgress}
          onDuration={handleDuration}
          onEnded={handleEnd}
        />
        <div className="custom-controls">
          <Link href="/video" className="backLink">
            <span className="ctrl listBtn"> </span> <span>돌아가기</span>
          </Link>

          {/* Progress Bar */}
          {/* <div
            onClick={togglePlayPause}
            className={playing ? "ctrl Pause" : "ctrl Play"}
          ></div> */}
          <div className="progress-bar-wrapper">
            <div className="progress-container">
              <input
                type="range"
                className="progress-bar"
                min={0}
                max={duration}
                value={progress}
                onChange={(e) => handleSeek(Number(e.target.value))}
              />
              <div
                className="custom-thumb"
                style={{
                  left: `${progressPercentage}%`,
                }}
              ></div>

              <div
                className="progress-indicator"
                style={{
                  left: `${progressPercentage}%`,
                }}
              >
                {formatTime(progress)}
              </div>
            </div>
            <div className="time-info">
              {/* Play/Pause Button */}

              <div>
                <span>{formatTime(progress)} | </span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .video-player-wrapper {
          position: relative;
          width: 100%;
          height: auto;
        }

        .custom-controls {
          margin-top: 20px;
        }

        .progress-bar-wrapper {
          position: relative;
          width: 100%;
          height: 56px;
          margin: 0px 0 10px 0;
        }

        .progress-container {
          position: relative;
          height: 56px;
        }

        .progress-bar {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 56px;
          -webkit-appearance: none;
          appearance: none;
          background: transparent !important;
          border-radius: 0px;
          outline: none;
          cursor: pointer;
          touch-action: none;
          z-index: 2;
        }

        .progress-container::before {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          top: 26px;
          height: 4px;
          background: linear-gradient(
            to right,
            #de002b 0%,
            #de002b ${progressPercentage}%,
            rgba(230, 230, 230, 0.3) ${progressPercentage}%,
            rgba(230, 230, 230, 0.3) 100%
          );
          z-index: 1;
        }

        .progress-bar::-webkit-slider-runnable-track {
          width: 100%;
          height: 56px;
          background: transparent;
        }

        .progress-bar::-moz-range-track {
          width: 100%;
          height: 56px;
          background: transparent;
        }

        .progress-bar::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 56px;
          height: 56px;
          border: 0;
          border-radius: 50%;
          background: transparent;
        }

        .progress-bar::-moz-range-thumb {
          width: 56px;
          height: 56px;
          border: 0;
          border-radius: 50%;
          background: transparent;
        }

        .custom-thumb {
          position: absolute;
          top: 13px;
          left: 0;
          transform: translateX(-50%);

          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: #de002b;
          border: 5px solid rgba(255, 255, 255, 0.3);
          animation: pulse-border 2s infinite;
          pointer-events: none; /* 슬라이더와 충돌하지 않도록 클릭 이벤트 비활성화 */
          z-index: 3;
        }

        @keyframes pulse-border {
          0% {
            border-width: 5px;
            border-color: rgba(255, 255, 255, 0.3);
          }
          50% {
            border-width: 10px;
            border-color: rgba(255, 255, 255, 0.6);
          }
          100% {
            border-width: 5px;
            border-color: rgba(255, 255, 255, 0.3);
          }
        }
        .progress-indicator {
          position: absolute;
          display: none;
          top: -30px;
          transform: translateX(-50%);
          background: black;
          color: white;
          font-size: 20px;
          padding: 2px 5px;
          border-radius: 5px;
        }

        .time-info {
          display: flex;
          justify-content: space-between;
          font-size: 25px;
          gap: 8px;
          
          filter: drop-shadow(5px 5px 20px rgba(0, 0, 0, 0.4));
          pointer-events: none; /* 클릭 이벤트 비활성화 */
        }
      `}</style>
    </>
  );
};

export default VideoPlayer;

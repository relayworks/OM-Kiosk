"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getKioskSocket } from "../lib/kiosk-socket";
import ReStageHodongStage from "./ReStageHodongStage";

export default function CurtainAnimation() {
  const router = useRouter();
  const [playbackKey, setPlaybackKey] = useState(0);

  useEffect(() => {
    const socket = getKioskSocket();
    socket.emit("kiosk:done", { current: "restage_hodong" });

    const handlePageChange = async (contentSelect) => {
      if (contentSelect === "reStageHodong") {
        setPlaybackKey((prevKey) => prevKey + 1);
        socket.emit("pageStatus", { state: "done", target: contentSelect });
        return;
      }

      if (contentSelect === "prevPage") {
        socket.emit("kiosk:busy", { current: "coverflow" });
        socket.emit("pageStatus", {
          state: "navigating",
          target: contentSelect,
        });

        try {
          await router.push("/coverflow");
          socket.emit("pageStatus", { state: "done", target: contentSelect });
        } catch (e) {
          socket.emit("pageStatus", {
            state: "error",
            target: contentSelect,
            reason: "ROUTE_FAIL",
          });
          socket.emit("kiosk:done", { current: "restage_hodong" });
        }
        return;
      }

      if (contentSelect === "reStageChunhee") {
        socket.emit("kiosk:busy", { current: "restage_chunhee" });
        socket.emit("pageStatus", {
          state: "navigating",
          target: contentSelect,
        });

        try {
          await router.push("/restage_chunhee");
          socket.emit("pageStatus", { state: "done", target: contentSelect });
        } catch (e) {
          socket.emit("pageStatus", {
            state: "error",
            target: contentSelect,
            reason: "ROUTE_FAIL",
          });
          socket.emit("kiosk:done", { current: "restage_hodong" });
        }
      }
    };

    socket.off("changePage");
    socket.on("changePage", handlePageChange);

    return () => {
      socket.off("changePage", handlePageChange);
    };
  }, [router]);

  const handleEnded = () => {
    const socket = getKioskSocket();
    socket.emit("kiosk:busy", { current: "coverflow" });
    router.push("/coverflow");
    socket.emit("kiosk:done", { current: "idle" });
    socket.emit("pageStatus", { state: "done", target: "prevPage" });
  };

  return <ReStageHodongStage active playbackKey={playbackKey} onEnded={handleEnded} />;
}

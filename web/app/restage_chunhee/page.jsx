"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getKioskSocket } from "../lib/kiosk-socket";
import ReStageChunheeStage from "./ReStageChunheeStage";

export default function ReStage() {
  const router = useRouter();
  const [playbackKey, setPlaybackKey] = useState(0);

  useEffect(() => {
    const socket = getKioskSocket();
    socket.emit("kiosk:done", { current: "restage_chunhee" });

    const onChangePage = async (contentSelect) => {
      if (contentSelect === "reStageChunhee") {
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
          socket.emit("kiosk:done", { current: "restage_chunhee" });
        }
        return;
      }

      if (contentSelect === "reStageHodong") {
        socket.emit("kiosk:busy", { current: "restage_hodong" });
        socket.emit("pageStatus", {
          state: "navigating",
          target: contentSelect,
        });

        try {
          await router.push("/restage_hodong");
          socket.emit("pageStatus", { state: "done", target: contentSelect });
        } catch (e) {
          socket.emit("pageStatus", {
            state: "error",
            target: contentSelect,
            reason: "ROUTE_FAIL",
          });
          socket.emit("kiosk:done", { current: "restage_chunhee" });
        }
      }
    };

    socket.off("changePage");
    socket.on("changePage", onChangePage);

    return () => {
      socket.off("changePage", onChangePage);
    };
  }, [router]);

  const handleEnded = () => {
    const socket = getKioskSocket();
    socket.emit("kiosk:busy", { current: "coverflow" });
    router.push("/coverflow");
    socket.emit("kiosk:done", { current: "idle" });
    socket.emit("pageStatus", { state: "done", target: "prevPage" });
  };

  return <ReStageChunheeStage active playbackKey={playbackKey} onEnded={handleEnded} />;
}

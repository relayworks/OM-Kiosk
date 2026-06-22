"use client";

import { io } from "socket.io-client";

let socket = null;
let heartbeat = null;

export function getKioskSocket() {
  // 🔴 이미 생성된 적이 있으면 무조건 재사용
  if (socket) return socket;

  socket = io();

  socket.on("connect", () => {
    console.log("Kiosk connected:", socket.id);

    socket.emit("kiosk:ready", {current:"coverflow"});   // ⭐ 이것도 반드시 필요 (서버 코드 기준)

    if (heartbeat) clearInterval(heartbeat);
    heartbeat = setInterval(() => {
      socket.emit("kiosk:heartbeat");
    }, 5000);
  });

  socket.on("disconnect", () => {
    console.log("Kiosk disconnected");
    if (heartbeat) clearInterval(heartbeat);
  });

  return socket;
}

import { io } from "socket.io-client";

let socket = null;
let registered = false;

function getControllerHost() {
  const params = new URLSearchParams(window.location.search);
  const hostFromQuery = params.get("host");
  const hostFromStorage = window.localStorage.getItem("kioskHost");
  const hostFromEnv = process.env.NEXT_PUBLIC_KIOSK_HOST;

  return hostFromQuery || hostFromStorage || hostFromEnv || window.location.hostname;
}

export async function getControllerSocket() {
  if (socket) return socket;

  const host = getControllerHost();
  const port = window.location.port || "3000";

  console.log("Connecting controller to kiosk:", host);

  socket = io(`http://${host}:${port}`, {
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
  });

  // ⭐ 핵심: 이미 연결된 상태도 처리
  const register = () => {
    if (registered) return;
    registered = true;
    console.log("REGISTER CONTROLLER");
    socket.emit("register", "controller");
  };

  if (socket.connected) {
    register(); // 이미 연결된 경우
  } else {
    socket.on("connect", register); // 아직 연결 안된 경우
  }

  socket.on("connect_error", (e) => {
    console.log("Controller connection failed:", e.message);
  });

  return socket;
}

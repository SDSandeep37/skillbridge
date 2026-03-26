import { io } from "socket.io-client";

// export const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL,{
//   transports:["websocket"],
// });
export const socket = io(
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5001",
  {
    autoConnect: false
  }
);
// autoConnect:false prevents multiple connections when components re-render.
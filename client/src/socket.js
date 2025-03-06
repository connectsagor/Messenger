import { io } from "socket.io-client";
const BASE_URL = "http://localhost:5000";
export const onlineUsers = [];
let socket;
export const connectSocket = function (id) {
  socket = io(BASE_URL, {
    query: {
      userId: id,
    },
  });
  socket.connect();

  socket.on("onlineUsers", (userIds) => {
    onlineUsers.push(userIds);
  });
};

export { socket };
export const disconnectSocket = function () {};

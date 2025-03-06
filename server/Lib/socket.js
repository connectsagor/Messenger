const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {};
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  const userId = socket.handshake.query.userId;

  if (userId) userSocketMap[userId] = socket.id;

  io.emit("onlineUsers", Object.keys(userSocketMap));

  // User joins a chat room
  socket.on("joinChat", (receiverId) => {
    socket.join(receiverId);
    console.log(`User joined chat: ${receiverId}`);
  });

  // When a message is sent
  socket.on("sendMessage", (message) => {
    console.log("Message received:", message);

    // Emit message to users in the same chat room
    io.to().emit("receiveMessage", message);
  });

  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    io.emit("onlineUsers", Object.keys(userSocketMap));
    console.log("User Disconnected:", socket.id);
  });
});

module.exports = { io, app, server };

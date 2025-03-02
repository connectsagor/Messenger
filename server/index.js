const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const http = require("http");
const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");

app.use(cors());
app.use(bodyParser.json());

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});
const userSocketMap = {};

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  socket.on("registerUser", (userId) => {
    userSocketMap[userId] = socket.id;

    console.log("User registered:", userId, "with socket:", socket.id);
  });

  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const receiverSocketId = userSocketMap[receiverId];

    // Send message only to the intended receiver
    io.to(receiverSocketId).emit("receiveMessage", { senderId, text });

    // Also send message back to the sender
    io.to(socket.id).emit("receiveMessage", { senderId, text });
  });

  // socket.on("message", (message) => {
  //   console.log("Received message:", message);
  //   io.emit("message", { text: message.text, sender: message.sender });
  // });

  socket.on("disconnect", () => {
    for (const userId in userSocketMap) {
      if (userSocketMap[userId] === socket.id) {
        delete userSocketMap[userId];
        break;
      }
    }
    console.log("User disconnected:", socket.id);
  });
});

mongoose.connect(process.env.URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const UsersSchema = new mongoose.Schema({
  name: String,
  email: String,
  uid: String,
  photo: { type: String, default: "" },
  bio: { type: String, default: "" },
  location: { type: String, default: "" },
  phone: { type: String, default: "" },
});

const Users = mongoose.model("Users", UsersSchema);

app.post("/api/create-users", async (req, res) => {
  const userData = req.body;
  const user = await Users.create(userData);
  res.status(200).json({ message: "User created successfully", user: user });
});

app.get("/api/get-users", async (req, res) => {
  const currentUserId = req.query.currentUserId;
  const ALlUsers = await Users.find({ uid: { $ne: currentUserId } });
  res
    .status(200)
    .json({ message: "Users fetched successfully", user: ALlUsers });
});

app.get("/api/get-user", async (req, res) => {
  const userId = req.query.id;
  const user = await Users.find({ uid: userId });
  res.status(200).json({ message: "User fetched successfully", user: user });
});

server.listen(5000, () => {
  console.log("Server is running on port 5000");
});

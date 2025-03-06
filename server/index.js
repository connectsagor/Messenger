const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const http = require("http");
const multer = require("multer");
const path = require("path");
const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const User = require("./models/UserModel");
const Message = require("./models/MessageModel");

app.use(cors());
app.use(bodyParser.json());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + file.originalname;
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Allow frontend to connect
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // User joins a chat room
  socket.on("joinChat", (chatId) => {
    socket.join(chatId);
    console.log(`User joined chat: ${chatId}`);
  });

  // When a message is sent
  socket.on("sendMessage", (message) => {
    console.log("Message received:", message);

    // Emit message to users in the same chat room
    io.to(message.chatId).emit("receiveMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);
  });
});

mongoose.connect(process.env.URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.post("/api/create-users", async (req, res) => {
  const userData = req.body;
  const user = await User.create(userData);
  res.status(200).json({ message: "User created successfully", user: user });
});

app.get("/api/get-users", async (req, res) => {
  const currentUserId = req.query.currentUserId;
  const ALlUsers = await User.find({ uid: { $ne: currentUserId } });
  res
    .status(200)
    .json({ message: "Users fetched successfully", user: ALlUsers });
});

app.get("/api/get-my-data", async (req, res) => {
  const currentUserId = req.query.currentUserId;
  const myData = await User.find({ uid: currentUserId });
  res
    .status(200)
    .json({ message: "My data fetched successfully", user: myData });
});

app.get("/api/get-user", async (req, res) => {
  const id = req.query.id;
  const user = await User.find({ _id: id });
  res.status(200).json({ message: "User fetched successfully", user: user });
});

app.patch("/api/upload-dp", upload.single("file"), async (req, res) => {
  const userId = req.query.userId;
  const photoName = req.file.filename;

  const updateUser = await User.findOneAndUpdate(
    { uid: userId },
    { photo: photoName }
  );

  res.status(501).json({
    message: "Update user",
    data: updateUser,
  });
});

//One to One chat

app.post("/api/one-to-one", async (req, res) => {
  const { user1, user2 } = req.body;

  let chat = await Chat.findOne({
    isGroupChat: false,
    users: { $all: [user1, user2] },
  });

  if (!chat) {
    chat = await Chat.create({ users: [user1, user2], isGroupChat: false });
  }

  res.json(chat);
});

//Group chat

app.post("/group", async (req, res) => {
  const { users, groupName } = req.body;

  const chat = await Chat.create({ users, groupName, isGroupChat: true });
  res.json(chat);
});

//Send Message
// app.post("/api/chat/message", async (req, res) => {
//   const { sender, content, chatId } = req.body;

//   const message = await Message.create({ sender, content, chat: chatId });
//   await Chat.findByIdAndUpdate(
//     chatId,
//     { $push: { messages: message._id } },
//     { new: true, useFindAndModify: false }
//   );

//   res.json(message);
// });
app.post("/api/chat/message", async (req, res) => {
  try {
    const { sender, content, chatId } = req.body;

    if (!sender || !content || !chatId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create message
    const message = await Message.create({ sender, content, chatId });

    // Push message to Chat model
    const chat = await Chat.findByIdAndUpdate(
      chatId,
      { $push: { messages: message._id } },
      { new: true, useFindAndModify: false }
    );

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.get("/api/chat/:chatId/messages", async (req, res) => {
  try {
    const chatId = req.params.chatId;

    // Fetch all messages for this chat
    const messages = await Message.find({ chatId }).populate(
      "sender",
      "name email"
    );

    res.json(messages);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching messages", error: error.message });
  }
});

server.listen(5000, () => {
  console.log("Server is running on port 5000");
});

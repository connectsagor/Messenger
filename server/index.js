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
    origin: "http://localhost:3000",
  },
});
// const userSocketMap = {};

// io.on("connection", (socket) => {
//   console.log("a user connected", socket.id);

//   socket.on("registerUser", (userId) => {
//     userSocketMap[userId] = socket.id;

//     console.log("User registered:", userId, "with socket:", socket.id);
//   });

//   socket.on("sendMessage", ({ senderId, receiverId, text }) => {
//     const receiverSocketId = userSocketMap[receiverId];

//     // Send message only to the intended receiver
//     io.to(receiverSocketId).emit("receiveMessage", { senderId, text });

//     // Also send message back to the sender
//     io.to(socket.id).emit("receiveMessage", { senderId, text });
//   });

//   // socket.on("message", (message) => {
//   //   console.log("Received message:", message);
//   //   io.emit("message", { text: message.text, sender: message.sender });
//   // });

//   socket.on("disconnect", () => {
//     for (const userId in userSocketMap) {
//       if (userSocketMap[userId] === socket.id) {
//         delete userSocketMap[userId];
//         break;
//       }
//     }
//     console.log("User disconnected:", socket.id);
//   });
// });

// Socket Io

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinChat", (chatId) => {
    socket.join(chatId);
  });

  socket.on("sendMessage", (message) => {
    io.to(message.chat).emit("receiveMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

mongoose.connect(process.env.URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    uid: String,
    photo: { type: String, default: "" },
    bio: String,
    location: String,
    phone: String,
  },
  { timestamps: true }
);

const chatSchema = new mongoose.Schema(
  {
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
    groupName: { type: String, default: null },
  },
  { timestamps: true }
);

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: String,
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
const Chat = mongoose.model("Chat", chatSchema);
const Message = mongoose.model("Message", messageSchema);

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
app.post("/api/chat/message", async (req, res) => {
  const { sender, content, chatId } = req.body;

  const message = await Message.create({ sender, content, chat: chatId });
  await Chat.findByIdAndUpdate(
    chatId,
    { $push: { messages: message._id } },
    { new: true, useFindAndModify: false }
  );

  res.json(message);
});

server.listen(5000, () => {
  console.log("Server is running on port 5000");
});

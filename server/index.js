const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const multer = require("multer");
const path = require("path");

const User = require("./models/UserModel.js");
const Message = require("./models/MessageModel.js");
const { app, server, io, getReceiverSocketId } = require("./Lib/socket.js");

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

app.post("/api/chat/message", async (req, res) => {
  try {
    const { sender, receiver, text } = req.body;

    if (!sender || !receiver || !text) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const message = await Message.create({ sender, receiver, text });

    if (!message) {
      return res.status(400).json({ message: "Message not sent!" });
    }

    const receiverSocketId = getReceiverSocketId(receiver);

    io.to(receiverSocketId).emit("newMessage", message);
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.get("/api/get-messages", async (req, res) => {
  const messages = await Message.find({});

  res.status(201).json({ message: "fetched successfully", messages: messages });
});

server.listen(5000, () => {
  console.log("Server is running on port 5000");
});

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const app = express();

app.use(cors());
app.use(bodyParser.json());
const port = 5000;
mongoose.connect(process.env.URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const UsersSchema = new mongoose.Schema({
  name: String,
  email: String,
  uid: String,
  photo: {
    type: String,
    default: "",
  },
  bio: {
    type: String,
    default: "",
  },
  location: {
    type: String,
    default: "",
  },
  phone: {
    type: String,
    default: "",
  },
});
const Users = mongoose.model("Users", UsersSchema);

app.post("/api/create-users", async (req, res) => {
  const userData = req.body;
  const user = await Users.create(userData);
  res.status(200).json({
    message: "User created successfully",
    user: user,
  });
});

app.get("/api/get-users", async (req, res) => {
  const ALlUsers = await Users.find({});
  res.status(200).json({
    message: "Users fetched successfully",
    user: ALlUsers,
  });
});

app.get("/api/get-user", async (req, res) => {
  const userId = req.query.id;
  const user = await Users.find({ uid: userId });

  res.status(200).json({
    message: "User fetched successfully",
    user: user,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

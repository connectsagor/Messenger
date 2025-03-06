import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    uid: String,
    photo: { type: String, default: "" },
    bio: String,
    location: String,
    phone: String,
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

export default User;

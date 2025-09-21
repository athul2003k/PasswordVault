import mongoose from "mongoose";

const PasswordSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // links password to a specific user
    required: true,
  },
  siteName: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  website: {
    type: String,
    default: "",
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true, // will be encrypted before saving
  },
  notes: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Password", PasswordSchema);

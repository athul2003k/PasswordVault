import mongoose from "mongoose";

const PasswordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  site: String,
  username: String,
  password: String, // encrypted text
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  notes: String
}, { timestamps: true });

export default mongoose.model("Password", PasswordSchema);

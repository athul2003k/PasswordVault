import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // category belongs to a user
  name: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model("Category", CategorySchema);

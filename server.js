import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import passwordRoutes from "./routes/passwords.js";
import categoryRoutes from "./routes/categories.js";

dotenv.config();
const app = express();

// Middlewares
app.use(cors());            // Allow cross-origin requests
app.use(express.json());    // Parse JSON body requests

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/passwords", passwordRoutes);
app.use("/api/categories", categoryRoutes);

// DB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

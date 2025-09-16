import express from "express";
import Password from "../models/Password.js";
import auth from "../middleware/auth.js";
import { encrypt, decrypt } from "../utils/crypto.js";

const router = express.Router();

// Create
router.post("/", auth, async (req, res) => {
  try {
    const { site, username, password, category, notes } = req.body;
    const newPassword = new Password({
      userId: req.user.id,
      site,
      username,
      password: encrypt(password), // encrypt before saving
      category,
      notes
    });
    await newPassword.save();
    res.json(newPassword);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Read all
router.get("/", auth, async (req, res) => {
  try {
    const passwords = await Password.find({ userId: req.user.id }).populate("category", "name");
    res.json(passwords.map(p => ({
      ...p._doc,
      password: decrypt(p.password), // decrypt before sending
      category: p.category?.name || "Uncategorized"
    })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update
router.put("/:id", auth, async (req, res) => {
  try {
    const { site, username, password, category, notes } = req.body;
    const updated = await Password.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { site, username, password: encrypt(password), category, notes },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete
router.delete("/:id", auth, async (req, res) => {
  try {
    await Password.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: "Password deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

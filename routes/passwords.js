import express from "express";
import auth from "../middleware/auth.js";
import Password from "../models/Password.js";
import { encrypt, decrypt } from "../utils/crypto.js";

const router = express.Router();

/**
 * @route   POST /api/passwords
 * @desc    Create a new password entry
 * @access  Private
 */
router.post("/", auth, async (req, res) => {
  try {
    const { siteName, category, website, username, password, notes } = req.body;

    if (!siteName || !category || !username || !password) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const encryptedPassword = encrypt(password);

    const newPassword = new Password({
      user: req.user.id,
      siteName,
      category,
      website,
      username,
      password: encryptedPassword,
      notes,
    });

    await newPassword.save();
    res.json({ message: "Password saved successfully", password: newPassword });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   GET /api/passwords
 * @desc    Get all passwords for the logged-in user
 * @access  Private
 */
router.get("/", auth, async (req, res) => {
  try {
    const passwords = await Password.find({ user: req.user.id });

    // Decrypt passwords before sending back
    const decrypted = passwords.map((entry) => ({
      ...entry._doc,
      password: decrypt(entry.password),
    }));

    res.json(decrypted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   PUT /api/passwords/:id
 * @desc    Update a password entry
 * @access  Private
 */
router.put("/:id", auth, async (req, res) => {
  try {
    const { siteName, category, website, username, password, notes } = req.body;

    // Build update object
    const updateData = {};
    if (siteName) updateData.siteName = siteName;
    if (category) updateData.category = category;
    if (website) updateData.website = website;
    if (username) updateData.username = username;
    if (password) updateData.password = encrypt(password); // encrypt new password
    if (notes) updateData.notes = notes;

    const updated = await Password.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $set: updateData },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Password not found" });
    }

    res.json({ message: "Password updated", password: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   DELETE /api/passwords/:id
 * @desc    Delete a password entry
 * @access  Private
 */
router.delete("/:id", auth, async (req, res) => {
  try {
    const deleted = await Password.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Password not found" });
    }

    res.json({ message: "Password deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

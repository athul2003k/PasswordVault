import express from "express";
import Category from "../models/Category.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Create
router.post("/", auth, async (req, res) => {
  try {
    const { name } = req.body;
    const category = new Category({ userId: req.user.id, name });
    await category.save();
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Read
router.get("/", auth, async (req, res) => {
  try {
    const categories = await Category.find({ userId: req.user.id });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update
router.put("/:id", auth, async (req, res) => {
  try {
    const { name } = req.body;
    const updated = await Category.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { name },
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
    await Category.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

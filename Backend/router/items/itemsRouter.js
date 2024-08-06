const express = require("express");
const Items = require("../../database/items/itemsData");
const router = express.Router();
const authenticate = require("../../middleware/verifyToken");

//! Get items
router.get("/", authenticate, async (req, res) => {
  try {
    const email = req.user.email;
    const items = await Items.find({ owner: email });
    if (!items) {
      return res.status(404).json({ msg: "items Not Found" });
    }
    return res.status(200).json(items);
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error", error });
  }
});

//! Create items
router.post("/createItems/newItem", authenticate, async (req, res) => {
  const { title, content, createdAt, updatedAt, owner } = req.body;
  try {
    const items = new Items({
      title,
      content,
      createdAt,
      updatedAt,
      owner,
    });
    await items.save();
    return res.status(201).json({ msg: "items Create Successfully", items });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error", error });
  }
});

//! Update item
router.put("/updateItem/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  const { title, content, updatedAt } = req.body;
  try {
    const item = await Items.findByIdAndUpdate(
      id,
      {
        title,
        content,
        updatedAt,
      },
      { new: true }
    );
    if (!item) {
      return res.status(404).json({ msg: "items Not Found" });
    }
    return res.status(200).json({ msg: "item Update Successfully", item });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error", error });
  }
});

//! Delete item
router.delete("/deleteItem/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    const item = await Items.findByIdAndDelete(id);
    if (!item) {
      return res.status(404).json({ msg: "items Not Found" });
    }
    return res.status(200).json({ msg: "item Deleted Successfully", item });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error", error });
  }
});

module.exports = router;

const mongoose = require("mongoose");

const itemsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
  },
  owner: {
    type: String,
  },
});

module.exports = mongoose.model("items", itemsSchema);

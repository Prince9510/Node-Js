const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  bookName: {
    type: String,
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  bookPrice: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

const fristSchema = mongoose.model("bookStoreData", schema);

module.exports = fristSchema;
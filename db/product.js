const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  email: String,
  userId: String,
  price: String,
  category: String,
  company: String,
});

module.exports = mongoose.model("products", productSchema);

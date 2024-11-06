// product.model.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    image: String, // URL of the product image
    stock: Number,
});

module.exports = mongoose.model("Product", productSchema);

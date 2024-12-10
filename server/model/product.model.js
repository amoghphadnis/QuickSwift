import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    category: { type: String },
    image: { type: String }, // URL to the product image
    stockStatus: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
});

const Product = mongoose.model('Product', ProductSchema);
export default Product;

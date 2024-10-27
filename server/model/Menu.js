import mongoose from "mongoose";
const Schema = mongoose.Schema;

// Function to generate a custom itemId
const generateItemId = (businessType) => {
    const prefixMap = {
        restaurant: 'R',
        grocery_store: 'G',
        cafe: 'C',
        bakery: 'B',
    };

    const prefix = prefixMap[businessType] || 'U'; // Default to 'U' for unknown types
    const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, '').slice(0, 14); // Format YYYYMMDDHHMMSS
    const randomSuffix = Math.floor(Math.random() * 100); // Random number between 0 and 99

    return `${prefix}${timestamp}${randomSuffix}`; // Combine to form itemId
};

const menuSchema = new Schema({
    itemId: { type: String, unique: true }, // Will be generated automatically
    name: { type: String, required: true }, // Name of the item (e.g., "Veg Biryani", "Tomatoes")
    description: { type: String, required: false }, // Brief description of the item (optional)
    price: { type: Number, required: true }, // Price of the item
    quantity: { type: Number, default: 0 }, // Number of items available in stock
    category: { type: String, required: true }, // Category of the item (e.g., "Main Course", "Fruits", "Pastries")
    availabilityStatus: { type: Boolean, default: true }, // Availability status (in stock or out of stock)
    imageUrl: { type: String }, // URL of the image for display purposes

    // Business-specific fields (optional)
    businessId: { type: Schema.Types.ObjectId, ref: 'Business', required: true }, // Reference to the associated Business

  
    unitOfMeasurement: { type: String, required: false }, // Applicable for grocery items (e.g., kg, lbs, each)
    allergenInformation: { type: String, required: false }, // Information about common allergens (if applicable)

    // Optional field for baked items
    bakedGoodsType: { type: String, required: false }, // e.g., "Bread", "Cake", "Pastry" (specific to bakery items)
    adminApprovalStatus: { type: Boolean, default: false },
});

// Pre-save hook to generate itemId automatically
menuSchema.pre('save', function (next) {
    if (!this.itemId) {
        this.itemId = generateItemId(this.businessType);
    }
    next();
});

// Exporting the model
export const Menu = mongoose.model('Menu', menuSchema);

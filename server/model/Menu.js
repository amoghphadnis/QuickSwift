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
    itemId: { type: String, unique: true }, 
    name: { type: String, required: true }, 
    description: { type: String, required: false }, 
    category: { type: String, required: true }, 
    subcategory: { type: String, required: false },
    price: { type: Number, required: true }, 
    quantity: { type: Number, default: 0 },
    unitOfMeasurement: { type: String, required: false },
    stockStatus: { type: Boolean, default: true },
    allergenInformation: { type: String, required: false },
    imageItem: { type: String },
    businessId: { type: Schema.Types.ObjectId, ref: 'Business', required: true },
    featured: { type: Boolean, default: false },
    discount: { type: Number, default: 0 },
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

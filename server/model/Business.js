import mongoose from "mongoose";
const Schema = mongoose.Schema;
// Generic schema for business information
const businessSchema = new Schema({
  businessLicense: { type: String, required: true }, // Business license information
  businessType: { 
    type: String, 
    required: true,
    enum: ['restaurant', 'grocery_store', 'cafe', 'bakery', 'other'] // Possible types of businesses
  },
  businessLocation: {
    address: { type: String, required: true }, // Business address
    city: { type: String, required: true }, // City of the business
    postalCode: { type: String, required: true } // Postal code
  }
});

// Export the generic business info schema
export const Business = mongoose.model('Business', businessSchema);


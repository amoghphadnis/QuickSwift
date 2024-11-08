import mongoose from "mongoose";
const Schema = mongoose.Schema;

// Schema for opening hours for each day
const openingHourSchema = new Schema({
  day: { type: String, required: true, enum: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
  openTime: { type: String, required: true },  // Start time in "hh:mm am/pm" format
  closeTime: { type: String, required: true }, // End time in "hh:mm am/pm" format
});

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
    postalcode: { type: String, required: true } // Postal code
  },
  businessName: { type: String, required: true },
  businessLogo: { type: String }, // URL to the business logo
  bannerImage: { type: String }, 
  openingHours: [openingHourSchema],  // Array of opening hours for each day
});

// Export the generic business info schema
export const Business = mongoose.model('Business', businessSchema);

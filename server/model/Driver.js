import mongoose from "mongoose";
const Schema = mongoose.Schema;

const driverInfoSchema = new Schema({
  driverLicense: { type: String, required: true },
  vehicle: {
    make: { type: String},
    model: { type: String },
    year: { type: Number },
    licensePlate: { type: String,required: true },
    insuranceProof: { type: String },
  },
});

// Export the driver info schema
export const Driver = mongoose.model('Driver', driverInfoSchema);

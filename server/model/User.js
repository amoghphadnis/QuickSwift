import mongoose from "mongoose";
const Schema = mongoose.Schema;

 



const generateUserId = () => {
  const timestamp = Date.now().toString(36); // Convert timestamp to base 36
  const randomNum = Math.floor(Math.random() * 1000000).toString(36); // Random number in base 36
  return `${timestamp}-${randomNum}`; // Combine them to create a unique ID
};


const userSchema = new Schema({
  userId: { type: String, unique: true, required: true, default: generateUserId }, // Unique identifier for the user
  username: { type: String, required: true }, // User's display name
  email: { type: String, required: true, unique: true }, // User's email address
  password: { type: String, required: true }, // Hashed password
  userType: { 
    type: String, 
    required: true, 
    enum: ['admin', 'driver', 'customer', 'business'] // Ensure valid role types
  },
  createdAt: { type: Date, default: Date.now }, // Account creation timestamp
  updatedAt: { type: Date, default: Date.now }, // Last updated timestamp
  status: { 
    type: String, 
    default: function() {
      // Default status to 'pending' for drivers and restaurants
      return this.userType === 'driver' || this.userType === 'business' ? 'pending' : 'active';
    } 
  }, // User status: 'active', 'inactive', 'pending'
  profilePicture: String, // URL to profile picture
  phoneNumber: String, // Optional: User's phone number
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  // References to driver and restaurant information
  driverInfo: {
    type:Schema.Types.ObjectId,
  ref:'Driver'
}, // Reference to the Driver schema
  businessInfo: {
    type:Schema.Types.ObjectId,
  ref:'Business'
} // Reference to the Restaurant schema
});



// Create the User model
export  const User = mongoose.model('User', userSchema);


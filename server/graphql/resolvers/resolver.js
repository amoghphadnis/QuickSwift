import { User } from "../../model/User.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Driver } from '../../model/Driver.js';
import { Business } from '../../model/Business.js';
import { Menu } from '../../model/Menu.js';
import verifyAuthToken from "../../middleware/verifyAuthToken.js";
import paypal from '@paypal/checkout-server-sdk';
import client from '../../paypal/paypalClient.js';
import {auth, storage,db}  from '../../firebase/firebaseConfig.js'
import { createUserWithEmailAndPassword} from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { config } from "dotenv";



export const resolvers = {
  Query: {
    getUser: async (_, { id, userType }, { headers }) => {
      const decoded = verifyAuthToken(headers);

      // Check if the userId matches the decoded token id
      if (decoded.id !== id) throw new Error('You are not authorized to access this user');

      const foundUser = await User.findById(id).populate('driverInfo').populate('businessInfo');
      if (!foundUser || foundUser.userType !== userType) throw new Error('User not found');
      return foundUser;
    },

    getAllUsers: async (_, __, { headers }) => {
      verifyAuthToken(headers); // Only need verification, no decoded details needed
      const users = await User.find().populate('driverInfo').populate('businessInfo');
      return users.filter(user => user.driverInfo || user.businessInfo);
    },

    getMenuItems: async (_, { businessId }, { headers }) => {
      verifyAuthToken(headers);
      try {
        const menuItems = await Menu.find({ businessId }).populate('businessId');
        console.log('menuItems...!!',menuItems)
        return menuItems;
      } catch (error) {
        throw new Error('Error retrieving menu items: ' + error.message);
      }
    },
    getMenuItemsList: async (_, __, { headers }) => {
      verifyAuthToken(headers);

      try {
          // Fetch all menu items and populate the businessType field from the Business model
          const menuItemsList = await Menu.find().populate('businessId');
          
          // Transform the result to include businessType directly in the menu item response
          const menuItemsWithBusinessType = menuItemsList.map(menuItem => {
            const itemObject = menuItem.toObject();
            return {
                id: itemObject._id.toString(), // Ensure `id` is mapped correctly from `_id`
                ...itemObject,
                businessType: itemObject.businessId?.businessType || null,
                businessId: itemObject.businessId?._id.toString() || null // Ensure businessId exists and is a string
            };
        });
       console.log('menuItemsWithBusinessType...!!',menuItemsWithBusinessType)
          return menuItemsWithBusinessType;
      } catch (error) {
          console.error('Error fetching menu items:', error);
          throw new Error('Failed to fetch menu items.');
      }
  }
  },

  Mutation: {
    register: async (_, { username, email, password, userType,profilePicture, ...rest }) => {
      console.log('Register mutation started');

      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) throw new Error('User already exists');


      let profilePictureURL = null;
      let driverId = null;
      let businessId = null;
      let additionalInfo=null
      // Handle user type logic based on the userType (driver or business)
      if (userType === 'driver' || userType === 'business') {
         additionalInfo = await handleUserType(userType, rest);
        console.log('Additional info:', additionalInfo);
    
        // If the user is a driver, save the driverId
        if (userType === 'driver') {
          driverId = additionalInfo.driverInfo.toString(); // This is the string ID returned from MongoDB
        }
    
        // If the user is a business, save the businessId
        if (userType === 'business') {
          businessId = additionalInfo.businessInfo.toString(); // This is the string ID returned from MongoDB
        }
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const firebaseUser = await createUserWithEmailAndPassword(auth, email, password)
      .then(userCredential => userCredential.user)
      .catch(error => { throw new Error("Firebase Auth error: " + error.message); });

     

      if (profilePicture) {
        const storageRef = ref(storage, `profilePictures/${firebaseUser.uid}`);
        const uploadResult = await uploadBytes(storageRef, profilePicture);
        profilePictureURL = await getDownloadURL(uploadResult.ref);
    }

      const userDetails = doc(db, "UserDetails", firebaseUser.uid); 
      await setDoc(userDetails, {
        username,
        email,
        userType,
        profilePictureURL,
        driverInfo: driverId, 
        businessInfo: businessId, 
        createdAt: new Date().toISOString(),
    });

      // Create the user
      const user = new User({
        username,
        email,
        password: hashedPassword,
        userType,
        ...additionalInfo // Spread the additional info based on userType
      });
      console.log('User to be saved:', user);

      // Save the user to the database
      await user.save();

      return {
        id: user._id,
        username: user.username,
        email: user.email,
        userType: user.userType,
        driverInfo: user.driverInfo,
        businessInfo: user.businessInfo,
      };
    },

    login: async (_, { email, password, userType }) => {
      const user = await User.findOne({ email, userType });
      if (!user || user.userType !== userType || user.status !== 'active') {
        throw new Error('Invalid credentials or user is inactive');
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) throw new Error('Invalid password');

      const token = jwt.sign({ id: user._id, userType: user.userType }, process.env.JWT_SECRET, { expiresIn: '24h' });
      return { token, userId: user._id, userType: user.userType };
    },

    approveUser: async (_, { id }, { headers }) => {
      verifyAuthToken(headers); // Verifying the token
      const user = await User.findByIdAndUpdate(id, { status: 'active' }, { new: true });
      return user;
    },

    rejectUser: async (_, { id }, { headers }) => {
      verifyAuthToken(headers); // Verifying the token
      const user = await User.findByIdAndUpdate(id, { status: 'inactive' }, { new: true });
      return user;
    },

    addMenuItem: async (_, {
      name, 
      description, 
      price, 
      quantity, 
      stockStatus, 
      imageItem, 
      unitOfMeasurement, 
      allergenInformation, 
      category, 
      subcategory, 
      businessId, 
      featured = false,  
      discount = 0       
  }, { headers }) => {
      verifyAuthToken(headers); 
  
      const newMenuItem = new Menu({
          name,
          description,
          price,
          quantity,
          stockStatus,
          imageItem,
          unitOfMeasurement,
          allergenInformation,
          category,
          subcategory,
          businessId,
          featured,
          discount
      });
  
      await newMenuItem.save();
      return newMenuItem;
  },
  
  
    deleteMenuItem: async (_, { itemId }, { headers }) => {
      verifyAuthToken(headers); // Verifying the token
      const menuItem = await Menu.findOne({itemId});
      if (!menuItem) return { success: false, message: 'Menu item not found' };

      await Menu.findByIdAndDelete(menuItem._id);
      return { success: true, message: 'Menu item successfully deleted' };
    },

    updateMenuItem: async (_, { id, input }, { headers }) => {
      verifyAuthToken(headers); // Verifying the token
    
      try {
          // Find the menu item by ID
          const menuItem = await Menu.findById(id);
          if (!menuItem) {
              throw new Error('Menu item not found');
          }

          // Update fields in the menu item with input values
          Object.keys(input).forEach(key => {
              menuItem[key] = input[key];
          });

          // Save the updated item
          const updatedMenuItem = await menuItem.save();

          return updatedMenuItem;
      } catch (error) {
          console.error('Error updating menu item:', error);
          throw new Error('Failed to update menu item');
      }
  },
  createPaymentIntent: async (_, { description, amount },{ headers }) => {
    verifyAuthToken(headers);
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
        intent: "CAPTURE",
        purchase_units: [{
            amount: {
                currency_code: "USD",
                value: amount.toFixed(2),
            },
            description,
        }],
    });

    try {
        const response = await client.execute(request);
        return {
            id: response.result.id,
            clientSecret: response.result.id, // This can be used as client secret if needed
            status: response.result.status,
        };
    } catch (error) {
        console.error("Error creating payment intent:", error);
        throw new Error("Failed to create payment intent");
    }
  },
  capturePayment: async (_, { orderId },{ headers }) => {
    verifyAuthToken(headers);
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    try {
        const response = await client.execute(request);
        return {
            id: response.result.id,
            status: response.result.status,
        };
    } catch (error) {
        console.error("Error capturing payment:", error);
        throw new Error("Failed to capture payment");
    }
},
forgotPassword: async (_, { email }) => {
  try {
    // Send password reset email
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");
    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; 
    await user.save();

    const resetURL = `http://localhost:7000/reset-password/${user._id}/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,  
      },
    });

    await transporter.sendMail({
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: "Password Reset Request",
      text: resetURL,
    });

    console.log("Password reset email sent");

    return true; // Return success
  } catch (error) {
    console.error("Error resetting password: ", error.message);
    throw new Error(error.message); // Return error message to the client
  }
},
resetPassword: async (_, {userId, token, newPassword }) => {
  try {
    // Find user by reset token and check expiration
    const user = await User.findOne({
      _id: userId,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // Ensure token is not expired
    });

    if (!user) throw new Error("Invalid or expired token");

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password and clear reset fields
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    console.log("Password has been reset successfully");
    return true;
  } catch (error) {
    console.error("Error in resetPassword:", error.message);
    throw new Error("Failed to reset password");
  }
}


  }
};

// Optional helper function for handling user types
const handleUserType = async (userType, { driverLicense, vehicle, businessLicense, businessType, businessLocation,businessName,businessLogo,bannerImage,openingHours }) => {
 
  if (userType === 'driver') {
    if (!driverLicense || !vehicle) throw new Error('Complete driver information required');
    const driver = new Driver({ driverLicense, vehicle });
    const savedDriver = await driver.save();
    console.log('savedDriver...!!',savedDriver)

    return { driverInfo: savedDriver._id };
  }

  if (userType === 'business') {
    if (!businessLicense || !businessLocation) throw new Error('Complete business information required');
    const business = new Business({ businessLicense, businessType, businessLocation,businessName,businessLogo,bannerImage,openingHours});
    const savedBusiness = await business.save();
    return { businessInfo: savedBusiness._id };
  }

  return {}; // Return empty if no additional info is needed
};

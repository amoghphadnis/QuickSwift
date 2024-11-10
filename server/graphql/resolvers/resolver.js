import { User } from "../../model/User.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Driver } from '../../model/Driver.js';
import { Business } from '../../model/Business.js';
import { Menu } from '../../model/Menu.js';
import verifyAuthToken from "../../middleware/verifyAuthToken.js";
import paypal from '@paypal/checkout-server-sdk';
import client from '../../paypal/paypalClient.js';

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
    register: async (_, { username, email, password, userType, ...rest }) => {
      console.log('Register mutation started');

      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) throw new Error('User already exists');

      // Handle user type logic based on the userType (driver or business)
      const additionalInfo = await handleUserType(userType, rest);
      console.log('Additional info:', additionalInfo);

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      
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

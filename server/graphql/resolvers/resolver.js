import { User } from "../../model/User.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {Driver} from '../../model/Driver.js';
import { Business } from '../../model/Business.js';

export const resolvers = {
  Query: {
    getUser: async (_, { id,userType }, { headers }) => {
   
      const token = headers.authorization?.split(' ')[1]; // Extract the token

      if (!token) throw new Error('No token provided');

      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (err) {
        throw new Error('Invalid token');
      }

      // Check if the userId matches the decoded token id
      if (decoded.id !== id) throw new Error('You are not authorized to access this user');

      const foundUser = await User.findById(id)
      .populate('driverInfo')
      .populate('businessInfo');
        console.log('id...!!',id)
      if (!foundUser && foundUser.userType === userType) throw new Error('User not found');
      return foundUser;
    },
    getAllUsers: async (_,{},{ headers }) => {
      
      const token = headers.authorization?.split(' ')[1]; // Extract the token
      if (!token) throw new Error('No token provided');

      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (err) {
        throw new Error('Invalid token');
      }
      const users = await User.find()
      .populate('driverInfo')
      .populate('businessInfo');

         return users.filter(user => user.driverInfo || user.businessInfo);

    },
    getMenuItems: async (_, { businessId }, { headers }) => {
      const token = headers.authorization?.split(' ')[1]; // Extract the token

      if (!token) throw new Error('No token provided');

      let decoded;
      try {
          decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (err) {
          throw new Error('Invalid token');
      }

      // Fetch menu items associated with the businessId
      try {
          const menuItems = await Menu.find({ businessId }).populate('businessInfo');
          return menuItems;
      } catch (error) {
          throw new Error('Error retrieving menu items: ' + error.message);
      }
  }
  },

  Mutation: {
    register: async (_, {
      username, 
      email, 
      password, 
      userType, 
      phoneNumber, 
      profilePicture, 
      driverLicense, 
      vehicle, 
      businessLicense, 
      businessType, 
      businessLocation 
    }) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) throw new Error('User already exists');

      let driverID=null;

      if (userType === 'driver') {

        if (!driverLicense) throw new Error('Driver license is required for drivers');
        if (!vehicle || !vehicle.make || !vehicle.model || !vehicle.year || !vehicle.licensePlate) {
          throw new Error('Vehicle information is required for drivers');
        }

        const driver = new Driver({
          driverLicense,
          vehicle: {
            make: vehicle.make,
            model: vehicle.model,
            year: vehicle.year,
            licensePlate: vehicle.licensePlate,
            insuranceProof: vehicle.insuranceProof
          }
        });
        driverID = await driver.save(); // Save driver details in the Driver collection
    
        // Set the driver's ObjectId in userData
        
      }
      let businessID =null;
      if (userType === 'business') {
        if (!businessLicense) 
          throw new Error('Business license is required for businesses');
        if (!businessType) 
          throw new Error('Business type is required for businesses');
        if (!businessLocation || !businessLocation.address || !businessLocation.city || !businessLocation.postalCode) {
          throw new Error('Business location information is required for businesses');
        }
      
        const business = new Business({
          businessLicense,
          businessType,
          businessLocation: {
            address: businessLocation.address,
            city: businessLocation.city,
            postalCode: businessLocation.postalCode
          }
        });
      
        // Save business details in the Business collection and retrieve the business ID
        const savedBusiness = await business.save(); 
       businessID = savedBusiness._id; // Get the ObjectId of the saved business
      
      
      }
      
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({ 
        username, 
        email, 
        password: hashedPassword, 
        userType, 
        profilePicture, 
        phoneNumber, 
        driverInfo: userType === 'driver' ? driverID : null, 
        businessInfo: userType === 'business' ? businessID : null, 
        
      });

      
      

      try {
        await user.save();
      } catch (error) {
        console.error('Error saving user:', error);
        throw new Error('Error saving user');
      }
      console.log('after....user...!!',user);

      return { 
        id: user._id, 
        username: user.username, 
        email: user.email, 
        userType: user.userType,
        profilePicture: user.profilePicture, 
        phoneNumber: user.phoneNumber,
        driverLicense: user.driverLicense,
        vehicle: user.vehicle,
        businessLicense: user.businessLicense,
        businessType: user.businessType,
        businessLocation: user.businessLocation 
      };
    },

    login: async (_, { email, password ,userType }) => {
     
      const user = await User.findOne({ email,userType});
     
      if (!user || user.userType !== userType) {
        throw new Error('Invalid email, password, or user type');
    }

    if(user.status !== 'active'){
      throw new Error('User is not active ');
    }
      
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) throw new Error('Invalid password');

      const token = jwt.sign({ id: user._id, userType: user.userType }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return {
        token: token,
        userId: user._id,
        userType: user.userType // Return userType upon login
      };
    },
    approveUser: async (_, { id }, { headers }) => {
      const token = headers.authorization?.split(' ')[1]; // Extract the token from the Authorization header
      console.log('userId..appr..!!',id)

      if (!token) throw new Error('No token provided');
    
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
        // Optionally, check user roles or permissions here if necessary
      } catch (err) {
        throw new Error('Invalid token'); // Handle invalid token error
      }
    
      try {
        // Find and update user status to 'approved'
        const user = await User.findByIdAndUpdate(
          id,
          { status: 'active' },
          { new: true }
        );
        return user;
      } catch (error) {
        console.error('Error approving user:', error);
        throw new Error('Failed to approve user');
      }
    },

    rejectUser: async (_, { id }, { headers }) => {
      const token = headers.authorization?.split(' ')[1]; // Extract the token from the Authorization header
    
      if (!token) throw new Error('No token provided');
    
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
        // Optionally, check user roles or permissions here if necessary
      } catch (err) {
        throw new Error('Invalid token'); // Handle invalid token error
      }
    
      try {
        // Find and update user status to 'rejected'
        const user = await User.findByIdAndUpdate(
          id,
          { status: 'inactive' },
          { new: true }
        );
        return user;
      } catch (error) {
        console.error('Error rejecting user:', error);
        throw new Error('Failed to reject user');
      }
    },

    addMenuItem: async (_, { name, category, price, ingredients, businessId, size, expiryDate, specialInstructions }, { headers }) => {
      const token = headers.authorization?.split(' ')[1]; // Extract the token

      if (!token) throw new Error('No token provided');

      let decoded;
      try {
          decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (err) {
          throw new Error('Invalid token');
      }

      // Check if the userId matches the decoded token id
      if (decoded.id !== businessId) throw new Error('You are not authorized to add menu items for this business');

      // Create a new menu item
      const newMenuItem = new Menu({
          name,
          category,
          price,
          ingredients,
          businessId,
          size,
          expiryDate,
          specialInstructions,
      });

      try {
          // Save the new menu item to the database
          await newMenuItem.save();
          return newMenuItem; // Return the added menu item
      } catch (error) {
          throw new Error('Error adding menu item: ' + error.message);
      }
  },
  }
}

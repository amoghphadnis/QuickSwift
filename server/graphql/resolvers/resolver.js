import {User} from "../../model/User.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const resolvers = {

    Query: {
         getUser: async (_, { id }, { headers }) => {
       
      const token = headers.authorization?.split(' ')[1]; // Extract the token
     

      if (!token) throw new Error('No token provided');

      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (err) {
        throw new Error('Invalid token');
      }

      // You can optionally check if the userId matches the decoded token id
      if (decoded.id !== id) throw new Error('You are not authorized to access this user');

      const foundUser = await User.findById(id);
      

      if (!foundUser) throw new Error('User not found');

      return { id: foundUser._id, username: foundUser.username, email: foundUser.email };
    },

      },

    Mutation: {
        register: async (_, { username, email, password }) => {
            const existingUser = await User.findOne({ email });
            if (existingUser) throw new Error('User already exists');
      
            const hashedPassword = await bcrypt.hash(password, 10);
           
            const user = new User({ username, email, password: hashedPassword });
            

            await user.save();
            
            return user;
          },
          login: async (_, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) throw new Error('User does not exist');
            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) throw new Error('Invalid password');
            if (!email || !password) {
              alert('Email and password are required');
              return;
            }
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            
            return {
              token: token,
              userId: user._id
            };
          }
    }

}
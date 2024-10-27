// authHelpers.js
import jwt from 'jsonwebtoken';

 const verifyAuthToken = (headers) => {
  const token = headers.authorization?.split(' ')[1]; // Extract the token
  if (!token) throw new Error('No token provided');

  try {
    return jwt.verify(token, process.env.JWT_SECRET); // Return decoded token
  } catch (err) {
    throw new Error('Invalid token');
  }
};

export default verifyAuthToken;
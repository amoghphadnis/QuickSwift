import React, { createContext, useState,useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

// Create the context
const UserContext = createContext();

// Create the provider component
const UserProvider = ({ children }) => {
  const [userType, setUserType] = useState(null);
  const [userId, setUserId] = useState(null);


  const initializeUser = () => {
    const token = localStorage.getItem('token'); // Fetch token from localStorage
    console.log('taken....User..Context..!!')
    if (token) {
      try {
        const decodedToken = jwtDecode(token); // Decode the JWT token
        const { userType, id, exp } = decodedToken;

        // Check token expiration
        if (exp * 1000 < Date.now()) {
          localStorage.removeItem('token');
          setUserType(null);
          setUserId(null);
        } else {
          setUserType(userType);
          setUserId(id);
        }
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
      }
    }
  };

  useEffect(() => {
    initializeUser(); // Initialize user info on app load
  }, []);


  return (
    <UserContext.Provider value={{ userType, setUserType, userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };

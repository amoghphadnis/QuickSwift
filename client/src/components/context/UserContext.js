import React, { createContext, useState } from 'react';

// Create the context
const UserContext = createContext();

// Create the provider component
const UserProvider = ({ children }) => {
  const [userType, setUserType] = useState(null);
  const [userId, setUserId] = useState(null);

  return (
    <UserContext.Provider value={{ userType, setUserType, userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };

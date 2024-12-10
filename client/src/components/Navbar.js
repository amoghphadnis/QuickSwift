import React, { useContext, useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import { Link ,useNavigate} from 'react-router-dom';
import { UserContext } from './context/UserContext';
import { jwtDecode } from 'jwt-decode';

const Navbar = () => {
  const { userType, setUserType } = useContext(UserContext); 
  const [isTokenValid, setIsTokenValid] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkTokenValidity = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000; // Current time in seconds

          // Check if the token is expired
          if (decodedToken.exp < currentTime) {
            console.log('Token expired');
            handleLogout(); // Log the user out if the token has expired
          } else {
            setIsTokenValid(true); // Token is still valid
          }
        } catch (error) {
          console.error('Failed to decode token:', error);
          handleLogout(); // Log out if token is invalid
        }
      }
    }
    checkTokenValidity();
  },[userType]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUserType(null); // Reset user context
    navigate('/login'); // Redirect to login page
  };
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="logo">
          <Typography variant="h6">
            QuickSwift
          </Typography>
        </IconButton>
        <div style={{ marginLeft: 'auto' }}>
        {isTokenValid && userType === 'admin' ? (
            <>
              <Button color="inherit" component={Link} to="/admin/dashboard">Dashboard</Button>
              <Button color="inherit" component={Link} to="/admin/orders">Manage Orders</Button>
              <Button color="inherit" component={Link} to="/admin/users">Manage Users</Button>
              <Button color="inherit" component={Link} to="/admin/menuapprovals">Manage Menu Approvals</Button>
              {/* <Button color="inherit" component={Link} to="/admin/delivery">Manage Delivery Personnel</Button> */}
              <Button color="inherit" component={Link} to="/admin/analytics">Analytics</Button>
            </>
          ) : isTokenValid && userType === 'customer' ? (
            <>
              <Button color="inherit" component={Link} to="/customer/profile">Profile</Button>
              <Button color="inherit" component={Link} to="/order-tracking">My Orders</Button>
              <Button color="inherit" component={Link} to="/cartpage">Cart</Button>
              <Button color="inherit" component={Link} to="/customer/home">Home</Button>
            </>
          ) : isTokenValid && userType === 'delivery' ? (
            <>
              <Button color="inherit" component={Link} to="/delivery/orders">Available Orders</Button>
              <Button color="inherit" component={Link} to="/delivery/history">Delivery History</Button>
            </>
          ) : isTokenValid && userType === 'business'? (
            <>
              <Button color="inherit" component={Link} to="/business/dashboard">Dashboard</Button>
              <Button color="inherit" component={Link} to="/business/orders">Orders</Button>
              <Button color="inherit" component={Link} to="/business/menumanagement">Menu Management</Button>
              <Button color="inherit" component={Link} to="/business/promotions">Promotions & Offers</Button>
              <Button color="inherit" component={Link} to="/business/profile">Restaurant Profile</Button>

            </>
          ):(
            <>
              {/* Default for non-logged-in users */}
              <Button color="inherit" component={Link} to="/login">Login</Button>
              <Button color="inherit" component={Link} to="/signup">Signup</Button>
            </>
          )}

          {/* Logout button visible for logged-in users */}
          {isTokenValid && (
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          )}
         
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

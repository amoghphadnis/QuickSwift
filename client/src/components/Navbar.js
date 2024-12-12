import React, { useContext, useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Link ,useNavigate} from 'react-router-dom';
import { UserContext } from './context/UserContext';
import { jwtDecode } from 'jwt-decode';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import ChatBox from './ChatBox';


const Navbar = () => {
  const { userType, setUserType } = useContext(UserContext); 
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [chatWith, setChatWith] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkTokenValidity = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000;

          if (decodedToken.exp < currentTime) {
            console.log('Token expired');
            handleLogout();
          } else {
            setIsTokenValid(true);
          }
        } catch (error) {
          console.error('Failed to decode token:', error);
          handleLogout();
        }
      }
    };
    checkTokenValidity();
  }, [userType]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUserType(null);
    navigate('/login');
  };

  const handleDialogOpen = (chatType) => {
    setChatWith(chatType);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setChatWith('');
  };

  const renderChatIcon = (chatType) => {
    switch (chatType) {
      case 'admin':
        return <SupervisorAccountIcon />;
      case 'driver':
        return <DriveEtaIcon />;
      case 'customer':
        return <AccountCircleIcon />;
      case 'business':
        return <BusinessCenterIcon />;
      default:
        return <AccountCircleIcon />;
    }
  };

  
  return (
    <>
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
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="logo">
            <Typography variant="h6">QuickSwift</Typography>
          </IconButton>
          <div style={{ marginLeft: 'auto' }}>
            {/* Different user-specific navigation buttons */}
            {isTokenValid && userType === 'admin' && (
              <>
                <Button color="inherit" component={Link} to="/admin/dashboard">Dashboard</Button>
                <Button color="inherit" component={Link} to="/admin/orders">Manage Orders</Button>
                <Button color="inherit" component={Link} to="/admin/users">Manage Users</Button>
                <Button color="inherit" component={Link} to="/admin/menuapprovals">Menu Approvals</Button>
                <Button color="inherit" component={Link} to="/admin/analytics">Analytics</Button>
              </>
            )}

            {isTokenValid && userType === 'customer' && (
              <>
                <Button color="inherit" component={Link} to="/customer/profile">Profile</Button>
                <Button color="inherit" component={Link} to="/order-tracking">My Orders</Button>
                <Button color="inherit" component={Link} to="/checkout">Checkout</Button>
                <Button color="inherit" component={Link} to="/customer/home">Home</Button>
              </>
            )}

            {isTokenValid && userType === 'driver' && (
              <>
                <Button color="inherit" component={Link} to="/driver/dashboard">Dashboard</Button>
              </>
            )}

            {isTokenValid && userType === 'business' && (
              <>
                <Button color="inherit" component={Link} to="/business/dashboard">Dashboard</Button>
                <Button color="inherit" component={Link} to="/business/orders">Orders</Button>
                <Button color="inherit" component={Link} to="/business/menumanagement">Menu Management</Button>
                <Button color="inherit" component={Link} to="/business/promotions">Promotions</Button>
                <Button color="inherit" component={Link} to="/business/profile">Restaurant Profile</Button>
              </>
            )}

            {isTokenValid && (
              <Button color="inherit" onClick={handleLogout}>Logout</Button>
            )}
          </div>
        </Toolbar>
      </AppBar>

      <div>
        {/* Chat icons based on the userType */}
        {userType === 'customer' && (
          <div>
            <IconButton onClick={() => handleDialogOpen('driver')}>{renderChatIcon('driver')}</IconButton>
            <IconButton onClick={() => handleDialogOpen('business')}>{renderChatIcon('business')}</IconButton>
            <IconButton onClick={() => handleDialogOpen('admin')}>{renderChatIcon('admin')}</IconButton>
          </div>
        )}

        {userType === 'driver' && (
          <div>
            <IconButton onClick={() => handleDialogOpen('customer')}>{renderChatIcon('customer')}</IconButton>
            <IconButton onClick={() => handleDialogOpen('business')}>{renderChatIcon('business')}</IconButton>
            <IconButton onClick={() => handleDialogOpen('admin')}>{renderChatIcon('admin')}</IconButton>
          </div>
        )}

        {userType === 'business' && (
          <div>
            <IconButton onClick={() => handleDialogOpen('customer')}>{renderChatIcon('customer')}</IconButton>
            <IconButton onClick={() => handleDialogOpen('driver')}>{renderChatIcon('driver')}</IconButton>
            <IconButton onClick={() => handleDialogOpen('admin')}>{renderChatIcon('admin')}</IconButton>
          </div>
        )}

        {userType === 'admin' && (
          <div>
            <IconButton onClick={() => handleDialogOpen('customer')}>{renderChatIcon('customer')}</IconButton>
            <IconButton onClick={() => handleDialogOpen('driver')}>{renderChatIcon('driver')}</IconButton>
            <IconButton onClick={() => handleDialogOpen('business')}>{renderChatIcon('business')}</IconButton>
          </div>
        )}

        {/* Dialog for Chat */}
        <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
          <DialogTitle>Chat with {chatWith.charAt(0).toUpperCase() + chatWith.slice(1)}</DialogTitle>
          <DialogContent>
            <ChatBox userType={userType} chatWith={chatWith} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="primary">Close</Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
    </>
  );
};

export default Navbar;



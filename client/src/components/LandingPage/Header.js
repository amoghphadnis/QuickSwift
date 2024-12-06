// src/components/LandingPage/Header.js
import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (userType) => {
    setAnchorEl(null);
    if (userType) {
      navigate(`/register/${userType}`);
    }
  };

  return (
    <AppBar position="static" sx={{ backgroundImage: 'linear-gradient(to left, #43C6AC, #F8FFAE)' }}>
      <Toolbar sx={{ color: '#3B4371' }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          QuickSwift
        </Typography>
        <Button color="inherit" onClick={() => navigate('/')}>Home</Button>
        <Button color="inherit" onClick={() => navigate('/features')}>Categories</Button>
        <Button color="inherit" onClick={() => navigate('/pricing')}>Blog</Button>
        <Button color="inherit" onClick={() => navigate('/contact')}>Contact</Button>
        <Button
          variant="contained"
          color="#3B4371"
          onClick={handleMenuClick}
          sx={{ backgroundColor: '#F8FFAE'}}
        >
          Sign Up Now
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => handleMenuClose(null)}
        >
          <MenuItem onClick={() => handleMenuClose('customer')}>Customer</MenuItem>
          <MenuItem onClick={() => handleMenuClose('driver')}>Driver</MenuItem>
          <MenuItem onClick={() => handleMenuClose('business')}>Business</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

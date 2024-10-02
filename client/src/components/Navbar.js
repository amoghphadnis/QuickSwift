import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="logo">
          <Typography variant="h6">
            QuickSwift
          </Typography>
        </IconButton>
        <div style={{ marginLeft: 'auto' }}>
          <Button color="inherit" component={Link} to="/home">Home</Button>
          <Button color="inherit" component={Link} to="/profile">Profile</Button>
          <Button color="inherit" component={Link} to="/login">Login</Button>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, TextField, Avatar, Tooltip, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const Header = () => {
  const [isOnline, setIsOnline] = useState(false);
  return (
    <AppBar position="static" color="transparent" elevation={0} sx={{ py: 1 }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6">Hello, Driver!</Typography>
        <Tooltip title={isOnline ? "Go Offline" : "Go Online"}>
          <Button
            variant="contained"
            color={isOnline ? "success" : "error"}
            onClick={() => setIsOnline(!isOnline)}
          >
            {isOnline ? "Go Offline" : "Go Online"}
          </Button>
        </Tooltip>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <SearchIcon />
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search anything..."
            sx={{ ml: 1, width: 300 }}
          />
          <Avatar sx={{ ml: 2 }}>D</Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

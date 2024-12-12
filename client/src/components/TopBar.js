import React, { useState, useEffect, useRef, useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemText, Divider, CircularProgress, Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';
import { UserContext } from './context/UserContext';
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api';
import { jwtDecode } from 'jwt-decode';

// Combined Navbar and TopBar Component
const TopBar = () => {
  const { userType, setUserType } = useContext(UserContext);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [location, setLocation] = useState("Fetching location...");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const autocompleteRef = useRef(null);
  const navigate = useNavigate();

  // Load Google Maps API
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyD1GGYAe2NjiFPZd0axntoSvAI9LYB0nCY', // Replace with your Google Maps API key
    libraries: ['places'],
  });

  // Validate Token
  useEffect(() => {
    const checkTokenValidity = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000; // Current time in seconds
          if (decodedToken.exp < currentTime) {
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
    setIsTokenValid(false);
    navigate('/login');
  };

  // Fetch Current Location
  const fetchCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          convertToAddress(latitude, longitude);
        },
        (error) => {
          setLocation("Location access denied");
          setIsLoading(false);
          console.error(error);
        }
      );
    } else {
      setLocation("Geolocation not supported");
      setIsLoading(false);
    }
  };

  const convertToAddress = async (latitude, longitude) => {
    if (isLoaded) {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyD1GGYAe2NjiFPZd0axntoSvAI9LYB0nCY`
        );
        const data = await response.json();
        setLocation(data.results[0]?.formatted_address || "Address not found");
      } catch (error) {
        console.error("Error fetching address:", error);
        setLocation("Error fetching address");
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded) {
      fetchCurrentLocation();
    }
  }, [isLoaded]);

  const handlePlaceSelect = () => {
    const place = autocompleteRef.current.getPlace();
    if (place && place.formatted_address) {
      setLocation(place.formatted_address);
      setIsDialogOpen(false);
    }
  };

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  return (
    <>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          {/* Sidebar Toggle */}
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ ml: 2, flexGrow: 1 }}>
            QuickSwift
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LocationOnIcon color="action" />
            {isLoading ? (
              <CircularProgress size={20} sx={{ ml: 1 }} />
            ) : (
              <Typography variant="body2" sx={{ ml: 1 }}>
                {location}
              </Typography>
            )}
            <Button size="small" onClick={() => setIsDialogOpen(true)} sx={{ ml: 1 }} color="primary">
              Change
            </Button>
            <IconButton aria-label="cart">
              <ShoppingCartIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer}>
        <Box sx={{ width: 250 }}>
          <List sx={{ display: 'flex', flexDirection: 'column'}}>
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
              <Button color="inherit" component={Link} to="/checkout">Checkout</Button>
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
          </List>
          <Divider />
        </Box>
      </Drawer>

      {/* Address Change Dialog */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} fullWidth maxWidth="sm" sx={{position: 'absolute', zIndex: '1'}}>
        <DialogTitle>Add your Address</DialogTitle>
        <DialogContent>
          {isLoaded && (
            <Autocomplete
              onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
              onPlaceChanged={handlePlaceSelect}
            >
              <TextField
                fullWidth
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for an address"
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1 }} />,
                }}
              />
            </Autocomplete>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TopBar;

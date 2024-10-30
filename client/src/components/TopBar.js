import React, { useState, useEffect, useRef } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Button, CircularProgress, Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api';

const TopBar = () => {
    const [location, setLocation] = useState("Fetching location...");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const autocompleteRef = useRef(null);

    // Load Google Maps API with useJsApiLoader
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: 'AIzaSyD1GGYAe2NjiFPZd0axntoSvAI9LYB0nCY',  // Replace with your Google Maps API key
        libraries: ['places'],
    });

    // Function to handle the address selected from the autocomplete
    const handleSaveAddress = (selectedAddress) => {
        setLocation(selectedAddress.formatted_address || "Selected address");
        setIsDialogOpen(false);
    };

    const handlePlaceSelect = () => {
        const place = autocompleteRef.current.getPlace();
        if (place && place.formatted_address) {
            handleSaveAddress(place);
        }
    };

    const fetchCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    console.log(latitude, longitude);
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
                    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=YOUR_GOOGLE_MAPS_API_KEY`
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

    const handleOpenDialog = () => setIsDialogOpen(true);
    const handleCloseDialog = () => setIsDialogOpen(false);

    return (
        <>
            <AppBar position="static" color="default" elevation={1}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" color="inherit" noWrap sx={{ ml: 1, mr: 3 }}>
                        QuickSwift
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', ml: 3 }}>
                        <LocationOnIcon color="action" />
                        {isLoading ? (
                            <CircularProgress size={20} sx={{ ml: 1 }} />
                        ) : (
                            <Typography variant="body2" sx={{ ml: 0.5 }}>
                                {location}
                            </Typography>
                        )}
                        <Button size="small" onClick={handleOpenDialog} sx={{ ml: 1 }} color="primary">
                            Change
                        </Button>
                    </Box>
                    <IconButton aria-label="cart">
                        <ShoppingCartIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            {/* Address Dialog for Selecting a New Address */}
            <Dialog open={isDialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                <DialogTitle>Add your Address</DialogTitle>
                <DialogContent>
                    {isLoaded && (
                        <Autocomplete
                            onLoad={(autocomplete) => {
                                autocompleteRef.current = autocomplete;
                                autocomplete.setFields(["geometry", "formatted_address"]);
                                autocomplete.addListener("place_changed", handlePlaceSelect);
                            }}
                        >
                            <TextField
                                fullWidth
                                placeholder="Search for an address"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                InputProps={{
                                    startAdornment: <SearchIcon sx={{ mr: 1 }} />
                                }}
                                sx={{ position: 'relative', zIndex: 1000 }}
                            />
                        </Autocomplete>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">Cancel</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default TopBar;

// src/components/TrackOrder.js
import React, { useState, useEffect } from 'react';
import { Typography, Card, CardContent, Grid, Divider, Button, Box, Avatar, Paper } from '@mui/material';
import Map from './Map'; // Placeholder for a map component to show driver location
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

// Placeholder driver data for demonstration
const driverData = {
    name: "John Doe",
    photo: "https://via.placeholder.com/150",
    contact: "+1234567890"
};

// Placeholder order tracking data for demonstration
const orderData = {
    id: "12345",
    restaurantName: "Sushi Palace",
    items: [
        { name: "Sushi Roll", quantity: 2 },
        { name: "Tempura", quantity: 1 }
    ],
    total: 45.00,
    status: "On the way",
    eta: "15 minutes",
    timeline: {
        placed: "2024-10-30T10:00:00Z",
        preparing: "2024-10-30T10:05:00Z",
        pickedUp: "2024-10-30T10:30:00Z",
        enRoute: "2024-10-30T10:40:00Z",
        delivered: null
    }
};

const TrackOrder = () => {
    const [orderStatus, setOrderStatus] = useState(orderData.status);

    // Update order status (in real implementation, you would use a WebSocket or polling API)
    useEffect(() => {
        // Simulate status change for demonstration purposes
        const interval = setInterval(() => {
            if (orderStatus === "On the way") {
                setOrderStatus("Delivered");
            }
        }, 30000);

        return () => clearInterval(interval);
    }, [orderStatus]);

    return (
        <Box sx={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>Track Your Order</Typography>

            {/* Order Summary Section */}
            <Paper elevation={3} sx={{ mb: 3, p: 2 }}>
                <Typography variant="h6" gutterBottom>Order Summary</Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography><strong>Order ID:</strong> #{orderData.id}</Typography>
                <Typography><strong>Restaurant Name:</strong> {orderData.restaurantName}</Typography>
                <Typography variant="h6" sx={{ mt: 2 }}>Items Ordered:</Typography>
                {orderData.items.map((item, index) => (
                    <Typography key={index} sx={{ ml: 2 }}>{item.quantity} x {item.name}</Typography>
                ))}
                <Typography variant="h6" sx={{ mt: 2 }}>Order Total: ${orderData.total.toFixed(2)}</Typography>
            </Paper>

            {/* Delivery Status Section */}
            <Paper elevation={3} sx={{ mb: 3, p: 2 }}>
                <Typography variant="h6" gutterBottom>Delivery Status</Typography>
                <Divider sx={{ mb: 2 }} />

                {/* Map Component (Replace with real map implementation) */}
                <Box sx={{ my: 2, height: '200px', backgroundColor: '#e0e0e0', borderRadius: '8px' }}>
                    <Map /> {/* Placeholder component */}
                </Box>

                <Typography><strong>ETA:</strong> {orderData.eta}</Typography>
                <Typography><strong>Current Status:</strong> {orderStatus}</Typography>

                {/* Driver Details */}
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                    <Avatar src={driverData.photo} alt={driverData.name} sx={{ width: 56, height: 56, mr: 2 }} />
                    <Box>
                        <Typography variant="body1"><strong>Driver:</strong> {driverData.name}</Typography>
                        <Typography variant="body2">Contact: {driverData.contact}</Typography>
                    </Box>
                </Box>
            </Paper>

            {/* Order Timeline Section */}
            <Paper elevation={3} sx={{ mb: 3, p: 2 }}>
                <Typography variant="h6" gutterBottom>Order Timeline</Typography>
                <Divider sx={{ mb: 2 }} />

                <Typography><strong>Order Placed:</strong> {new Date(orderData.timeline.placed).toLocaleString()}</Typography>
                <Typography><strong>Food Preparation Started:</strong> {new Date(orderData.timeline.preparing).toLocaleString()}</Typography>
                <Typography><strong>Driver Picked Up Order:</strong> {new Date(orderData.timeline.pickedUp).toLocaleString()}</Typography>
                <Typography><strong>En Route:</strong> {new Date(orderData.timeline.enRoute).toLocaleString()}</Typography>
                {orderData.timeline.delivered ? (
                    <Typography><strong>Delivered:</strong> {new Date(orderData.timeline.delivered).toLocaleString()}</Typography>
                ) : (
                    <Typography><strong>Delivered:</strong> Pending</Typography>
                )}
            </Paper>

            {/* Customer Actions */}
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<DirectionsBikeIcon />}
                        fullWidth
                        href={`tel:${driverData.contact}`}
                        sx={{ padding: '10px 0', fontSize: '16px' }}
                    >
                        Contact Driver
                    </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Button
                        variant="outlined"
                        color="secondary"
                        startIcon={<HelpOutlineIcon />}
                        fullWidth
                        sx={{ padding: '10px 0', fontSize: '16px' }}
                    >
                        Help
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default TrackOrder;

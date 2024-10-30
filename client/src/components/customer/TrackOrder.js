// src/components/TrackOrder.js
import React, { useState, useEffect } from 'react';
import { Typography, Card, CardContent, Grid, Divider, Button, Box, Avatar } from '@mui/material';
import Map from './Map'; // Placeholder for a map component to show driver location
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';

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
            <Typography variant="h4" gutterBottom>Track Your Order</Typography>

            {/* Order Summary Section */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6">Order Summary</Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography>Order ID: #{orderData.id}</Typography>
                    <Typography>Restaurant Name: {orderData.restaurantName}</Typography>
                    <Typography variant="h6" sx={{ mt: 2 }}>Items Ordered:</Typography>
                    {orderData.items.map((item, index) => (
                        <Typography key={index}>{item.quantity} x {item.name}</Typography>
                    ))}
                    <Typography variant="h6" sx={{ mt: 2 }}>Order Total: ${orderData.total.toFixed(2)}</Typography>
                </CardContent>
            </Card>

            {/* Delivery Status Section */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6">Delivery Status</Typography>
                    <Divider sx={{ my: 1 }} />

                    {/* Map Component (Replace with real map implementation) */}
                    <Box sx={{ my: 2, height: '200px', backgroundColor: '#e0e0e0' }}>
                        <Map /> {/* Placeholder component */}
                    </Box>

                    <Typography>Estimated Time of Arrival (ETA): {orderData.eta}</Typography>
                    <Typography>Current Status: {orderStatus}</Typography>

                    {/* Driver Details */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                        <Avatar src={driverData.photo} alt={driverData.name} sx={{ width: 56, height: 56, mr: 2 }} />
                        <Box>
                            <Typography variant="body1">Driver: {driverData.name}</Typography>
                            <Typography variant="body2">Contact: {driverData.contact}</Typography>
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            {/* Order Timeline Section */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6">Order Timeline</Typography>
                    <Divider sx={{ my: 1 }} />

                    <Typography>Order Placed: {new Date(orderData.timeline.placed).toLocaleString()}</Typography>
                    <Typography>Food Preparation Started: {new Date(orderData.timeline.preparing).toLocaleString()}</Typography>
                    <Typography>Driver Picked Up Order: {new Date(orderData.timeline.pickedUp).toLocaleString()}</Typography>
                    <Typography>En Route: {new Date(orderData.timeline.enRoute).toLocaleString()}</Typography>
                    {orderData.timeline.delivered ? (
                        <Typography>Delivered: {new Date(orderData.timeline.delivered).toLocaleString()}</Typography>
                    ) : (
                        <Typography>Delivered: Pending</Typography>
                    )}
                </CardContent>
            </Card>

            {/* Customer Actions */}
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<DirectionsBikeIcon />}
                        fullWidth
                        href={tel:${driverData.contact}}
                    >
                    Contact Driver
                </Button>
            </Grid>
            <Grid item xs={6}>
                <Button variant="outlined" color="secondary" fullWidth>
                    Help
                </Button>
            </Grid>
        </Grid>
        </Box >
    );
};

export default TrackOrder;
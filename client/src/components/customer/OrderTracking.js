// src/components/OrderTracking.js
import React from 'react';
import { Typography, Card, CardMedia, CardContent, Button, Grid } from '@mui/material';

const OrderTracking = () => {
    // Placeholder order data
    const orders = [
        {
            id: 1,
            storeName: "Royal Paan",
            storeImage: "https://cn-geo1.uber.com/image-proc/resize/eats/format=webp/width=550/height=440/quality=70/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC9pbWFnZS1wcm9jL3Byb2Nlc3NlZF9pbWFnZXMvNzI3NTEzNmUxNTkyNzA5ZDA4MDRkOTEwMGE0ZGM5OTUvNGY0OGU3MTViNmMwNWI5YjAwYzNmYzQzNmI0ZWI2NWYuanBlZw==", // Replace with actual store image URL
            total: 36.16,
            createdAt: "2024-08-02T04:11:00Z",
            items: [
                { name: "Bhel Puri", quantity: 1, price: 12.05 },
                { name: "Kashmiri Mitha Paan", quantity: 1, price: 8.75 },
                { name: "Pastry (Eggless)", quantity: 1, price: 15.36 }
            ]
        },
        {
            id: 2,
            storeName: "Culture Crust",
            storeImage: "https://cn-geo1.uber.com/image-proc/resize/eats/format=webp/width=550/height=440/quality=70/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC9pbWFnZS1wcm9jL3Byb2Nlc3NlZF9pbWFnZXMvZTE2YzI1NTdkMTZlNzU4YzJkNjYyMTIzNzdjNTI0ZjIvNzkxNWM0YTc4YTlmOTRlZDU2MzE2YzdjNGRjMGVjODkuanBlZw==", // Replace with actual store image URL
            total: 36.76,
            createdAt: "2024-08-01T01:55:00Z",
            items: [
                { name: "Samosa Chat Pizza", quantity: 1, price: 20.50 },
                { name: "Orange Crush", quantity: 1, price: 6.00 },
                { name: "Peri-Peri Fries", quantity: 1, price: 10.26 }
            ]
        }
    ];

    return (
        <div style={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>Your Orders</Typography>
            {orders.map(order => (
                <Card key={order.id} style={{ marginBottom: '20px' }}>
                    <Grid container>
                        <Grid item xs={3}>
                            <CardMedia
                                component="img"
                                height="140"
                                image={order.storeImage}
                                alt={order.storeName}
                            />
                        </Grid>
                        <Grid item xs={9}>
                            <CardContent>
                                <Typography variant="h6">{order.storeName}</Typography>
                                <Typography color="textSecondary">
                                    {order.items.length} items for ${order.total} • {new Date(order.createdAt).toLocaleString()}
                                </Typography>
                                
                                {/* Action Buttons */}
                                <Button variant="outlined" style={{ marginTop: '10px', marginRight: '10px' }}>View Store</Button>
                                <Button variant="contained" color="secondary" style={{ marginTop: '10px' }}>Rate your order</Button>

                                {/* Order Item Details */}
                                <div style={{ marginTop: '10px' }}>
                                    {order.items.map((item, index) => (
                                        <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
                                            <Typography>{item.name}</Typography>
                                            <Typography color="textSecondary">{item.quantity} x ${item.price.toFixed(2)}</Typography>
                                        </div>
                                    ))}
                                </div>

                                {/* Receipt and Invoice Links */}
                                <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
                                    <Button variant="text" size="small">View Receipt</Button>
                                    <Button variant="text" size="small">Request Invoice</Button>
                                </div>
                            </CardContent>
                        </Grid>
                    </Grid>
                </Card>
            ))}
        </div>
    );
};

export default OrderTracking;

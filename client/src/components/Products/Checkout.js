import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import {
    Box,
    Typography,
    TextField,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Divider,
    CircularProgress,
    RadioGroup,
    FormControlLabel,
    Radio,
} from '@mui/material';
// import { setShippingInfo, clearCheckout } from '../../redux/checkoutSlice';
const Checkout = ({ totalPrice }) => {
    const cart = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const { shippingInfo } = useSelector((state) => state.checkout);
    const [localShippingInfo, setLocalShippingInfo] = useState(shippingInfo || {});
    const [isPaid, setIsPaid] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({});
    const [address, setAddress] = useState('');

    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping = localShippingInfo.shippingMethod === 'pickup' ? 0 : 5;
    const total = subtotal + shipping;

    // Handle any error during the checkout process
    const handleError = (err) => {
        console.error("PayPal checkout error:", err);
        setError("An error occurred during the payment process. Please try again.");
    };

    const getToken = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError({ auth: 'No token found. Please log in.' });
            throw new Error('No token found');
        }
        return token;
    };

    useEffect(() => {
        console.log('Cart at Checkout:', cart); // Debug the cart data
    }, [cart]);

    const validateShippingInfo = () => {
        const newErrors = {};
        if (!localShippingInfo.fullName) newErrors.fullName = "Full name is required.";
        if (!localShippingInfo.email) newErrors.email = "Email address is required.";
        if (!localShippingInfo.phone) newErrors.phone = "Phone number is required.";
        if (!localShippingInfo.address) newErrors.address = "Address is required.";
        setError(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Create an order using GraphQL
    const createOrder = async () => {
        console.log('heloo createOrder...!!')
        const token = getToken();
            
        if (!token) {
          throw new Error('No token found. Please log in.');
            return;
          }
          
        try {
            const response = await fetch('http://localhost:5000/graphql', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`, // Pass the token in the header
                },
                body: JSON.stringify({
                    query: `
                        mutation CreatePaymentIntent($description: String!, $amount: Float!) {
                            createPaymentIntent(description: $description, amount: $amount) {
                                id
                                clientSecret
                            }
                        }
                    `,
                    variables: {
                        description: 'Order description',
                        amount: total
                    }
                })
            });

            const result = await response.json();
            return result.data.createPaymentIntent.id;
        } catch (err) {
            console.error("Error creating payment intent:", err);
            setError("An error occurred while creating the order. Please try again.");
        }
    };

    const handleInputChange = (field) => (event) => {
        setLocalShippingInfo({ ...localShippingInfo, [field]: event.target.value });
    };

    // Handle successful payment approval
    const handleApprove = async (orderId) => {
        const token = localStorage.getItem('token');
            
        if (!token) {
          throw new Error('No token found. Please log in.');
            return;
          }
          
        try {
            const response = await fetch('http://localhost:5000/graphql', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`, // Pass the token in the header
                },
                body: JSON.stringify({
                    query: `
                        mutation CapturePayment($orderId: String!) {
                            capturePayment(orderId: $orderId) {
                                id
                                status
                            }
                        }
                    `,
                    variables: {
                        orderId
                    }
                })
            });

            const result = await response.json();
            if (result.data.capturePayment.status === "COMPLETED") {
                setIsPaid(true);
            } else {
                setError("Payment could not be completed. Please try again.");
            }
        } catch (err) {
            console.error("Error capturing payment:", err);
            setError("An error occurred while capturing payment.");
        }
    };

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4">Checkout</Typography>
            <Grid container spacing={4}>
                {/* Left Section: Shipping Info */}
                <Grid item xs={12} md={8}>
                    <Typography variant="h6">Shipping Information</Typography>
                    <RadioGroup
                        row
                        value={localShippingInfo.shippingMethod || 'delivery'}
                        onChange={(e) => setLocalShippingInfo({ ...localShippingInfo, shippingMethod: e.target.value })}
                        sx={{ mb: 3 }}
                    >
                        <FormControlLabel value="delivery" control={<Radio />} label="Delivery" />
                        <FormControlLabel value="pickup" control={<Radio />} label="Pick up" />
                    </RadioGroup>
                    <Grid container spacing={2}>
                        {['fullName', 'email', 'phone', 'address'].map((field) => (
                            <Grid item xs={12} key={field}>
                                <TextField
                                    fullWidth
                                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                                    value={localShippingInfo[field] || ''}
                                    onChange={handleInputChange(field)}
                                    error={!!error[field]}
                                    helperText={error[field]}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Grid>

                {/* Right Section: Cart Summary */}
                <Grid item xs={12} md={4}>
                    <Typography variant="h6">Review Your Cart</Typography>
                    {cart.map((item) => (
                        <Card key={item.id} sx={{ display: 'flex', mb: 2 }}>
                            <CardMedia
                                component="img"
                                sx={{ width: 80 }}
                                image={item.imageItem || 'https://via.placeholder.com/150'}
                                alt={item.name}
                            />
                            <CardContent>
                                <Typography>{item.name}</Typography>
                                <Typography color="textSecondary">{item.quantity} x ${item.price}</Typography>
                            </CardContent>
                        </Card>
                    ))}
                    <Divider sx={{ my: 2 }} />
                    <Typography>Subtotal: ${subtotal.toFixed(2)}</Typography>
                    <Typography>Shipping: ${shipping.toFixed(2)}</Typography>
                    <Typography variant="h6">Total: ${total.toFixed(2)}</Typography>
            
                    {isPaid ? (
                        <Typography color="success">Payment Successful!</Typography>
                    ) : loading ? (
                        <CircularProgress />
                    ) : (
                <PayPalScriptProvider
                    options={{
                        "client-id": "AeWUtxTl7UAIu5jiqfYMdE6Q-2l61BvaSQ2YWUI6__ecNT9BrCrcFQ0k7tn2cWr09P0R2Hfd_r0_flfx"
                    }}
                >
                    {loading && <p>Loading payment options...</p>}
                    <PayPalButtons
                        style={{ shape: "pill", layout: "horizontal" }}
                        createOrder={(data, actions) => createOrder()}
                        onApprove={(data, actions) => handleApprove(data.orderID)}
                        onError={handleError}
                    />
                </PayPalScriptProvider>
            )}
            </Grid>
        </Grid>
    </Box>
    );
};

export default Checkout;

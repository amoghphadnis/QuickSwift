import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, Grid, Button, Card, CardContent, CardMedia } from '@mui/material';
import { removeFromCart, updateQuantity } from '../../redux/cartSlice';

const CartPage = () => {
    const cart = useSelector((state) => state.cart); // Access cart state directly
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleRemoveFromCart = (id) => {
        dispatch(removeFromCart({ id }));
    };

    const handleProceedToCheckout = () => {
        if (cart.length === 0) {
            alert('Your cart is empty. Please add items before proceeding.');
            return;
        }
        navigate('/checkout'); // Navigate to the checkout page
    };

	const handleQuantityChange = (id, quantity) => {
        if (quantity > 0) {
            dispatch(updateQuantity({ id, quantity }));
        }
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    };

    if (!Array.isArray(cart) || cart.length === 0) {
        return (
            <Box sx={{ padding: 4, textAlign: 'center' }}>
                <Typography variant="h5">Your cart is empty</Typography>
                <Button variant="contained" color="primary" href="/">
                    Continue Shopping
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
                Shopping Cart
            </Typography>
            <Grid container spacing={3}>
                {cart.map((item) => (
                    <Grid item xs={12} key={item.id}>
                        <Card>
                            <Grid container spacing={2}>
                                <Grid item xs={3}>
                                    <CardMedia
                                        component="img"
                                        image={item.imageItem || 'https://via.placeholder.com/150'}
                                        alt={item.name}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <CardContent>
                                        <Typography variant="h6">{item.name}</Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            ${item.price} x {item.quantity}
                                        </Typography>
                                    </CardContent>
                                </Grid>
                                <Grid item xs={3} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={() => handleRemoveFromCart(item.id)}
                                        sx={{ mb: 1 }}
                                    >
                                        Remove
                                    </Button>
                                    <Box>
                                        <Button
                                            variant="outlined"
                                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                            sx={{ mr: 1 }}
                                        >
                                            -
                                        </Button>
                                        <Typography variant="body1" component="span">
                                            {item.quantity}
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                            sx={{ ml: 1 }}
                                        >
                                            +
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Box sx={{ mt: 4, textAlign: 'right' }}>
                <Typography variant="h5">Total: ${calculateTotal()}</Typography>
                <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleProceedToCheckout}>
                    Proceed to Checkout
                </Button>
            </Box>
        </Box>
    );
};

export default CartPage;

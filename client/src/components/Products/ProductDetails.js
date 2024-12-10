import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, Grid } from '@mui/material';

const ProductDetails = ({ open, onClose, product, onAddToCart, onProceedToCheckout }) => {
    if (!product) return null; // Ensure product is loaded before rendering

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
            aria-labelledby="product-details-title"
            aria-describedby="product-details-description">
            <DialogTitle>{product.name}</DialogTitle>
            <DialogContent>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <img
                            src={product.imageItem || 'https://via.placeholder.com/300'}
                            alt={product.name}
                            style={{ width: '100%', borderRadius: '8px' }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="body1" gutterBottom>
                            <strong>Description:</strong> {product.description || 'No description available'}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            <strong>Price:</strong> ${product.price}
                        </Typography>
                        {product.discount > 0 && (
                            <Typography variant="body1" gutterBottom>
                                <strong>Discount:</strong> {product.discount}%
                            </Typography>
                        )}
                        {product.ingredients && (
                            <Typography variant="body1" gutterBottom>
                                <strong>Ingredients:</strong> {product.ingredients}
                            </Typography>
                        )}
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="primary" onClick={onAddToCart}>
                    Add to Cart
                </Button>
                <Button variant="outlined" color="secondary" onClick={onProceedToCheckout}>
                    Proceed to Checkout
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ProductDetails;

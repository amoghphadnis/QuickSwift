// src/components/LandingPage/FeaturesSection.js
import React from 'react';
import { Container, Typography, Grid, Box, Card, CardContent } from '@mui/material';
import Icon from '@mui/material/Icon';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';

const features = [
    { icon: <PersonPinIcon sx={{ fontSize: 50, color: 'primary.main' }} />, title: 'Real-Time Tracking', description: 'Track your deliveries live from pickup to drop-off.' },
    { icon: <LocalShippingIcon sx={{ fontSize: 50, color: 'primary.main' }} />, title: 'Same-Day Delivery', description: 'Unmatched speed for all your essentials.' },
    { icon: <AssuredWorkloadIcon sx={{ fontSize: 50, color: 'primary.main' }} />, title: 'Secure Payments', description: 'Multiple secure payment options for a hassle-free experience.' },
];

const FeaturesSection = () => (
    <>
        <Container maxWidth="lg" sx={{ py: 5 }}>
            <Typography variant="h4" align="center" gutterBottom sx={{ mb: 6 }}>
                Features
            </Typography>
            <Grid container spacing={4}>
                {features.map((feature, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Box textAlign="center" sx={{ px: 2 }}>
                            <Icon sx={{ fontSize: 50, color: 'primary.main', mb: 2 }}>{feature.icon}</Icon>
                            <Typography variant="h6" mt={2} sx={{ mb: 1 }}>
                                {feature.title}
                            </Typography>
                            <Typography color="textSecondary">{feature.description}</Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>

            {/* Feature Section 1 */}
            <Box sx={{ mt: 10 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Organic Fresh Foods
                </Typography>
                <Grid container spacing={4}>
                    {[...Array(4)].map((_, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Card sx={{ height: '100%' }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>Product {index + 1}</Typography>
                                    <Typography variant="body2" color="textSecondary">Fresh and Organic</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Feature Section 2 */}
            <Box sx={{ mt: 10, backgroundColor: '#F9F9F9', py: 5 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    More Than 50 Products
                </Typography>
                <Grid container spacing={4}>
                    {[...Array(4)].map((_, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Card sx={{ height: '100%' }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>Category {index + 1}</Typography>
                                    <Typography variant="body2" color="textSecondary">Wide variety of products</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Benefits Section */}
            <Box sx={{ mt: 10, textAlign: 'center', py: 5 }}>
                <Typography variant="h4" sx={{ mb: 4 }}>
                    We Always Provide You The Best In Town
                </Typography>
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6">Great Daily Deal</Typography>
                        <Typography variant="body2" color="textSecondary">
                            Amazing discounts every day.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6">Free Delivery</Typography>
                        <Typography variant="body2" color="textSecondary">
                            Delivered at no extra cost.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6">Best Prices Ever</Typography>
                        <Typography variant="body2" color="textSecondary">
                            Affordable and high quality.
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    </>
);

export default FeaturesSection;

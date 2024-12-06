// src/components/LandingPage/HeroSection.js
import React from 'react';
import { Container, Typography, Button, Grid, TextField, Box } from '@mui/material';

const HeroSection = () => (
    <Box
        sx={{
            backgroundColor: '#EAFBF3',
            padding: '15px 20px',
            textAlign: 'center',
            backgroundImage: `url('https://firebasestorage.googleapis.com/v0/b/quickswift-delivery.firebasestorage.app/o/Banner%2FQuickSwift_Hero_Image.png?alt=media&token=e6bdf21e-98ef-4175-91c4-ba37ce08342f'), linear-gradient(to left, #43C6AC, #F8FFAE)`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            color: '#333',
            height: { xs: '70vh', sm: '100vh' }
        }}
    >
        <Container
            maxWidth="lg"
            sx={{
                textAlign: { xs: 'center', md: 'right' }, // Center-align text on small screens
                paddingY: 10,
                color: '#333',
            }}
        >
            <Typography variant="h1" gutterBottom sx={{ fontSize: { xs: '1.8rem', sm: '2.5rem' }, mb: 20 }}>
                Swift Deliveries, Every Day – Your Time Matters!
            </Typography>
            <Typography variant="h2" color="textSecondary" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.2rem' }, mb: 4 }}>
                QuickSwift simplifies same-day deliveries for groceries, essentials, and <br />
                personal items with seamless tracking and lightning-fast service.
            </Typography>
            <Box mt={4}>
                <Button variant="outlined" color="primary" sx={{ fontSize: '1rem', px: 4 }}>
                    Learn More
                </Button>
            </Box>
            <Box mt={4}>
                {/* <img src="https://via.placeholder.com/300x600" alt="App Mockup" style={{ width: '100%', maxWidth: 300 }} /> */}
            </Box>
        </Container>
    </Box>
);

export default HeroSection;

// src/components/LandingPage/Footer.js
import React from 'react';
import { Box, Typography, Container, Button } from '@mui/material';

const Footer = () => (
  <Box sx={{ bgcolor: 'primary.main', py: 3, color: 'white', textAlign: 'center' }}>
    <Container>
      <Typography variant="h6" gutterBottom>
        Download the QuickSwift App Now!
      </Typography>
      <Box>
        <Button variant="contained" color="secondary" sx={{ mr: 2 }}>
          App Store
        </Button>
        <Button variant="contained" color="secondary">
          Google Play
        </Button>
      </Box>
      <Typography mt={2}>&copy; 2024 QuickSwift. All rights reserved.</Typography>
    </Container>
  </Box>
);

export default Footer;

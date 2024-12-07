// src/components/LandingPage/TestimonialsSection.js
import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Grid } from '@mui/material';
import axios from 'axios';

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    axios.get('/api/testimonials') // Replace with your API endpoint
      .then((response) => setTestimonials(response.data))
      .catch((error) => console.error('Error fetching testimonials:', error));
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        What Our Customers Say
      </Typography>
      <Grid container spacing={4}>
        {testimonials.map((testimonial, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Box textAlign="center">
              <Typography variant="body1" color="textSecondary">
                "{testimonial.quote}"
              </Typography>
              <Typography variant="subtitle1" mt={2}>
                - {testimonial.name}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default TestimonialsSection;

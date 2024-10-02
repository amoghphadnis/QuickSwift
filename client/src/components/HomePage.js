import React from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';

const HomePage = () => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'row', padding: 4 }}>
            <Box sx={{ flex: 1, border: '1px solid gray', height: '300px' }}>
                <Typography variant="h6" align="center">
                    Map
                </Typography>
            </Box>

            <Box sx={{ flex: 1, padding: 2 }}>
                <TextField label="Pick-up Location" fullWidth margin="normal" />
                <TextField label="Drop-off Location" fullWidth margin="normal" />

                <Typography variant="h6" sx={{ mt: 2 }}>
                    Order Summary
                </Typography>
                <TextField label="Item 1" fullWidth margin="normal" />
                <TextField label="Item 2" fullWidth margin="normal" />
                <TextField label="Item 3" fullWidth margin="normal" />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <TextField label="Total Cost" />
                    <TextField label="Delivery Fee" />
                </Box>

                <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                    Place Order
                </Button>
            </Box>
        </Box>
    );
};

export default HomePage;
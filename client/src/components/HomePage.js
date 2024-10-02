import React from 'react';
import { TextField, Box, Typography } from '@mui/material';

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
            </Box>
        </Box>
    );
};

export default HomePage;
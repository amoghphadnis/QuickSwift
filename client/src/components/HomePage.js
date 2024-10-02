import React from 'react';
import { Box, Typography } from '@mui/material';

const HomePage = () => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'row', padding: 4 }}>
            <Box sx={{ flex: 1, border: '1px solid gray', height: '300px' }}>
                <Typography variant="h6" align="center">
                    Map
                </Typography>
            </Box>

            <Box sx={{ flex: 1, padding: 2 }}>
                <Typography variant="h6" sx={{ mt: 2 }}>
                    Order Summary
                </Typography>
            </Box>
        </Box>
    );
};

export default HomePage;
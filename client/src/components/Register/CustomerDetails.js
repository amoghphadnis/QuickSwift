import React from 'react';
import { TextField, Box } from '@mui/material';

function CustomerDetails({ formData, handleChange }) {
  return (
    <Box>
      <TextField
        label="Phone Number"
        name="phoneNumber"
        value={formData.phoneNumber}
        onChange={handleChange}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Profile Picture URL"
        name="profilePicture"
        value={formData.profilePicture}
        onChange={handleChange}
        fullWidth
        sx={{ mb: 2 }}
      />
    </Box>
  );
}

export default CustomerDetails;

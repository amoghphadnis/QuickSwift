import React from 'react';
import { TextField, Box } from '@mui/material';

function UserDetails({ formData, handleChange }) {
  return (
    <Box>
      <TextField
        label="Username"
        name="username"
        value={formData.username}
        onChange={handleChange}
        fullWidth
        required
        sx={{ mb: 2 }}
      />
      <TextField
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        fullWidth
        required
        sx={{ mb: 2 }}
      />
      <TextField
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        fullWidth
        required
        sx={{ mb: 2 }}
      />
    </Box>
  );
}

export default UserDetails;

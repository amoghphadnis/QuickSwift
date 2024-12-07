import React from 'react';
import { TextField, Box } from '@mui/material';

function UserDetails({ formData, handleChange, handleFileChange }) {
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
      <TextField
        label="Phone Number"
        name="phoneNumber"
        value={formData.phoneNumber}
        onChange={handleChange}
        fullWidth
        sx={{ mb: 2 }}
      />
      <label htmlFor="profilePicture" style={{ fontWeight: "normal", display: "block", marginBottom: "8px" }}>
        Upload your Profile Picture
      </label>
      <input
        type="file"
        name="profilePicture"
        id="profilePicture"
        accept="image/jpeg, image/png, image/webp"
        onChange={handleFileChange}
        style={{
          marginBottom: "16px",
          padding: "8px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      />
    </Box>
  );
}

export default UserDetails;

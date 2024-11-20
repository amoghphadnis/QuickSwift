import React from 'react';
import { TextField, Box } from '@mui/material';

function DriverDetails({ formData, handleChange }) {
  return (
    <Box>
      <TextField
        label="Driver License"
        name="driverLicense"
        value={formData.driverLicense}
        onChange={handleChange}
        fullWidth
        required
        sx={{ mb: 2 }}
      />
      <TextField
        label="Vehicle Make"
        name="vehicleMake"
        value={formData.vehicleMake}
        onChange={handleChange}
        fullWidth
        required
        sx={{ mb: 2 }}
      />
      <TextField
        label="Vehicle Model"
        name="vehicleModel"
        value={formData.vehicleModel}
        onChange={handleChange}
        fullWidth
        required
        sx={{ mb: 2 }}
      />
      <TextField
        label="Vehicle Year"
        name="vehicleYear"
        type="number"
        value={formData.vehicleYear}
        onChange={handleChange}
        fullWidth
        required
        sx={{ mb: 2 }}
      />
      <TextField
        label="License Plate"
        name="licensePlate"
        value={formData.licensePlate}
        onChange={handleChange}
        fullWidth
        required
        sx={{ mb: 2 }}
      />
      <TextField
        label="Insurance Proof"
        name="insuranceProof"
        value={formData.insuranceProof}
        onChange={handleChange}
        fullWidth
        required
        sx={{ mb: 2 }}
      />
    </Box>
  );
}

export default DriverDetails;

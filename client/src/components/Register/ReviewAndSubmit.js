import React from 'react';
import { Box, Typography, TextField } from '@mui/material';

function ReviewAndSubmit({ formData, userType }) {
  const renderRelevantFields = () => {
    switch (userType) {
      case 'business':
        return (
          <>
            <TextField
              label="Business Name"
              value={formData.businessName}
              fullWidth
              InputProps={{ readOnly: true }}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Business License"
              value={formData.businessLicense}
              fullWidth
              InputProps={{ readOnly: true }}
              sx={{ mb: 2 }}
            />
            <TextField 
            label="Business Type"
            value={formData.businessType}
            fullWidth
            InputProps={{readOnly: true }}
            sx={{ md: 2}}
            />
            <TextField
              label="Business Address"
              value={formData.businessLocation.address}
              fullWidth
              InputProps={{ readOnly: true }}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Business City"
              value={formData.businessLocation.city}
              fullWidth
              InputProps={{ readOnly: true }}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Business Postal Code"
              value={formData.businessLocation.postalcode}
              fullWidth
              InputProps={{ readOnly: true }}
              sx={{ mb: 2 }}
            />
          </>
        );
      case 'driver':
        return (
          <>
            <TextField
              label="Driver License"
              value={formData.driverLicense}
              fullWidth
              InputProps={{ readOnly: true }}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Vehicle Make"
              value={formData.vehicleMake}
              fullWidth
              InputProps={{ readOnly: true }}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Vehicle Model"
              value={formData.vehicleModel}
              fullWidth
              InputProps={{ readOnly: true }}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Vehicle Year"
              value={formData.vehicleYear}
              fullWidth
              InputProps={{ readOnly: true }}
              sx={{ mb: 2 }}
            />
            <TextField
              label="License PLate"
              value={formData.licensePlate}
              fullWidth
              InputProps={{ readOnly: true }}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Insurance Proof"
              value={formData.insuranceProof}
              fullWidth
              InputProps={{ readOnly: true }}
              sx={{ mb: 2 }}
            />
          </>
        );
      case 'admin':
      case 'customer':
        return (
          <>
            <TextField
              label="Username"
              value={formData.username}
              fullWidth
              InputProps={{ readOnly: true }}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Email"
              value={formData.email}
              fullWidth
              InputProps={{ readOnly: true }}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Phone Number"
              value={formData.phoneNumber}
              fullWidth
              InputProps={{ readOnly: true }}
              sx={{ mb: 2 }}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Review Your Details
      </Typography>
      {renderRelevantFields()}
    </Box>
  );
}

export default ReviewAndSubmit;

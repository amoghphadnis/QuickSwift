import React from 'react';
import { TextField, Button, Grid, MenuItem, Box, Typography } from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';

function BusinessDetails({ formData, handleChange, handleOpeningHoursChange, addOpeningHour, removeOpeningHour, handleFileChange }) {
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <Box>
      <TextField
              label="Business License"
              type="text"
              name="businessLicense"
              value={formData.businessLicense}
              onChange={handleChange}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <TextField
              label="Business Name"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              fullWidth
              required
              sx={{ mb: 2 }} />

            <TextField
              label="Business Type"
              select
              name="businessType"
              value={formData.businessType}
              onChange={handleChange}
              fullWidth
              required
              sx={{ mb: 2 }}
            >
              <MenuItem value="restaurant">Restaurant</MenuItem>
              <MenuItem value="grocery_store">Grocery Store</MenuItem>
              <MenuItem value="cafe">Cafe</MenuItem>
              <MenuItem value="bakery">Bakery</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </TextField>
            <label htmlFor="businessLogo" style={{ fontWeight: "normal", display: "block", marginBottom: "8px" }}>
            Upload your Logo
            </label>
            <input
              type="file"
              name="businessLogo"
              id="businessLogo"
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
            <label htmlFor="businessLogo" style={{ fontWeight: "normal", display: "block", marginBottom: "8px" }}>
            Upload your Cover Image
            </label>
            <input
              type="file"
              name="bannerImage"
              id="bannerImage"
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
            <TextField
              label="Business Address"
              type="text"
              name="businessAddress"
              value={formData.businessLocation.address}
              onChange={handleChange}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <TextField
              label="Business City"
              type="text"
              name="businessCity"
              value={formData.businessLocation.city}
              onChange={handleChange}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <TextField
              label="Business Postal Code"
              type="text"
              name="businessPostalCode"
              value={formData.businessLocation.postalcode}
              onChange={handleChange}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <Typography variant="h6" sx={{ mt: 3 }}>Opening Hours</Typography>
            {formData.openingHours.map((hour, index) => (
              <Grid container spacing={1} key={index} sx={{ mb: 2 }}>
                <Grid item xs={3}>
                  <TextField
                    label="Day"
                    name="day"
                    value={hour.day}
                    onChange={(e) => handleOpeningHoursChange(index, 'day', e.target.value)}
                    select
                    fullWidth
                    required
                  >
                    {daysOfWeek.map((day) => (
                      <MenuItem key={day} value={day}>
                        {day}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    label="Open Time"
                    name="openTime"
                    type="time"
                    value={hour.openTime}
                    onChange={(e) => handleOpeningHoursChange(index, 'openTime', e.target.value)}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    label="Close Time"
                    name="closeTime"
                    type="time"
                    value={hour.closeTime}
                    onChange={(e) => handleOpeningHoursChange(index, 'closeTime', e.target.value)}
                    fullWidth
                    required
                  />
                </Grid>

              </Grid>
            ))}
            <Button
              startIcon={<AddCircleOutline />}
              onClick={addOpeningHour}
              color="primary"
              sx={{ mb: 2 }}
            >
              Add Opening Hour
            </Button>
    </Box>
  );
}

export default BusinessDetails;

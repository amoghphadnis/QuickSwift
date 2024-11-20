import React from 'react';
import { TextField, Button, Grid, MenuItem, Box } from '@mui/material';

function BusinessDetails({ formData, handleChange, handleOpeningHoursChange, addOpeningHour, removeOpeningHour }) {
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <Box>
      <TextField
        label="Business Name"
        name="businessName"
        value={formData.businessName}
        onChange={handleChange}
        fullWidth
        required
        sx={{ mb: 2 }}
      />
      <TextField
        label="Business License"
        name="businessLicense"
        value={formData.businessLicense}
        onChange={handleChange}
        fullWidth
        required
        sx={{ mb: 2 }}
      />
      <TextField
        label="Business Address"
        name="businessAddress"
        value={formData.businessLocation.address}
        onChange={handleChange}
        fullWidth
        required
        sx={{ mb: 2 }}
      />
      {/* Opening hours */}
      {formData.openingHours.map((hour, index) => (
        <Grid container spacing={1} key={index} sx={{ mb: 2 }}>
          <Grid item xs={4}>
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
          <Grid item xs={4}>
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
          <Grid item xs={4}>
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
      <Button variant="text" onClick={addOpeningHour}>
        Add Opening Hour
      </Button>
    </Box>
  );
}

export default BusinessDetails;

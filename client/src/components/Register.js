import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button,Grid,IconButton  ,Typography, Link, MenuItem } from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';

function Register({ userType }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phoneNumber: '',
    profilePicture: '',
    driverLicense: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '',
    licensePlate: '',
    insuranceProof: '',
    businessLicense: '',
    businessType: '',
    businessName: '',
    businessLogo: '',
    bannerImage: '',
    businessLocation: { // Updated to nest business location fields
      address: '',
      city: '',
      postalcode: ''
    },
    openingHours:[{ day: '', openTime: '', closeTime: '' }]
  });

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Check if the field is part of businessLocation
    if (name === 'businessAddress' || name === 'businessCity' || name === 'businessPostalCode') {
      const locationField = name.replace('business', '').toLowerCase();
      console.log('locationField...!!',locationField)
      setFormData(prevData => ({
        ...prevData,
        businessLocation: {
          ...prevData.businessLocation,
          [locationField]: value
        }
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    console.log('name..!!',name)
    console.log('files..!!',files)
    const maxSize = 10 * 1024 * 1024; // 10MB limit

    if (files && files[0].size > maxSize) {
      alert('File size exceeds the maximum limit of 10MB.');
      return;
    }

    if (files && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prevData => ({
          ...prevData,
          [name]: reader.result // Store the base64 string
        }));
      };
      reader.readAsDataURL(files[0]); // Convert file to base64
    }
    console.log('formdata..!!',formData)
  };

  const handleOpeningHoursChange = (index, field, value) => {
    setFormData((prevData) => {
      const newOpeningHours = [...prevData.openingHours];
      newOpeningHours[index][field] = value;
      return { ...prevData, openingHours: newOpeningHours };
    });
  };

  const addOpeningHour = () => {
    setFormData((prevData) => ({
      ...prevData,
      openingHours: [...prevData.openingHours, { day: '', openTime: '', closeTime: '' }]
    }));
  };

  const removeOpeningHour = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      openingHours: prevData.openingHours.filter((_, i) => i !== index)
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Basic validation
    const requiredFields = ['username', 'email', 'password'];
    if (userType === 'driver') requiredFields.push('driverLicense');
    if (userType === 'business') requiredFields.push('businessLicense', 'businessType', 'businessLocation.address', 'businessLocation.city', 'businessLocation.postalcode');

    for (const field of requiredFields) {
      const value = field.includes('.') ? field.split('.').reduce((o, i) => o[i], formData) : formData[field];
      if (!value) {
        alert(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return;
      }
    }

    try {
      const response = await fetch('http://localhost:5000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: `
            mutation Register(
              $username: String!,
              $email: String!,
              $password: String!,
              $userType: String!,
              $phoneNumber: String,
              $profilePicture: String,
              $driverLicense: String,
              $vehicle: VehicleInput,
              $businessLicense: String,
              $businessType: String,
              $businessName: String,
              $businessLogo: String,
              $bannerImage: String,
              $businessLocation: LocationInput,
              $openingHours: [OpeningHourInput]
            ) {
              register(
                username: $username,
                email: $email,
                password: $password,
                userType: $userType,
                phoneNumber: $phoneNumber,
                profilePicture: $profilePicture,
                driverLicense: $driverLicense,
                vehicle: $vehicle,
                businessLicense: $businessLicense,
                businessType: $businessType,
                businessName: $businessName,
                businessLogo: $businessLogo,
                bannerImage:  $bannerImage,
                businessLocation: $businessLocation,
                openingHours: $openingHours
              ) {
                id
                username
                email
                userType
               
                
              }
            }
          `,
          variables: {
            ...formData,
            userType: userType,
            driverLicense: userType === 'driver' ? formData.driverLicense : null,
            vehicle: userType === 'driver' ? {
              make: formData.vehicleMake,
              model: formData.vehicleModel,
              year: parseInt(formData.vehicleYear),
              licensePlate: formData.licensePlate,
              insuranceProof: formData.insuranceProof
            } : null,
            businessLicense: userType === 'business' ? formData.businessLicense : null,
            businessType: userType === 'business' ? formData.businessType : null,
            businessLocation: userType === 'business' 
            ? formData.businessLocation
            : null,   
          businessName: userType === 'business' ? formData.businessName : null,
          businessLogo: userType === 'business' ? formData.businessLogo : null,
          bannerImage: userType === 'business' ? formData.bannerImage : null,
          openingHours:userType === 'business' ? formData.openingHours : null,
          }
        })

      });
      console.log('response...!!',response.body)

      const result = await response.json();
      if (result.data && result.data.register) {
        alert('Registration successful as ' + userType);
        navigate(`/login/${userType}`);
      } else {
        alert('Registration failed: ' + (result.errors?.[0]?.message || 'Unknown error occurred.'));
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Registration failed due to an unexpected error.');
    }
  };

 

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        padding: 2,
      }}
    >
      <Typography variant="h4" sx={{ mb: 4 }}>
        Register as {userType.charAt(0).toUpperCase() + userType.slice(1)}
      </Typography>

      <form onSubmit={handleRegister} style={{ width: '100%', maxWidth: '400px' }}>
        <TextField
          label="Username"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Phone Number"
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        />
      <input
  type="file"
  name="profilePicture"
  onChange={handleFileChange}
  style={{ marginBottom: '16px' }}
/>

        {userType === 'driver' && (
          <>
            <TextField
              label="Driver License"
              type="text"
              name="driverLicense"
              value={formData.driverLicense}
              onChange={handleChange}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <TextField
              label="Vehicle Make"
              type="text"
              name="vehicleMake"
              value={formData.vehicleMake}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Vehicle Model"
              type="text"
              name="vehicleModel"
              value={formData.vehicleModel}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Vehicle Year"
              type="number"
              name="vehicleYear"
              value={formData.vehicleYear}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="License Plate"
              type="text"
              name="licensePlate"
              value={formData.licensePlate}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Insurance Proof"
              type="text"
              name="insuranceProof"
              value={formData.insuranceProof}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2 }}
            />
          </>
        )}

        {userType === 'business' && (
          <>
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
            <input type="file" name="businessLogo" onChange={handleFileChange} style={{ marginBottom: '16px' }} />
            <input type="file" name="bannerImage" onChange={handleFileChange} style={{ marginBottom: '16px' }} />

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
          </>
        )}

        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mb: 2 }}>
          Register
        </Button>
        <Typography>
          Already have an account? <Link href={`/login/${userType}`}>Log In</Link>
        </Typography>
      </form>
    </Box>
  );
}

export default Register;

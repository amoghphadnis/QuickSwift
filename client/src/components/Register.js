import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from '@mui/material';
import UserDetails from './Register/UserDetails';
import BusinessDetails from './Register/BusinessDetails';
import DriverDetails from './Register/DriverDetails';
import CustomerDetails from './Register/CustomerDetails';
import AdminDetails from './Register/AdminDetails';
import ReviewAndSubmit from './Register/ReviewAndSubmit';

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
    businessLocation: {
      address: '',
      city: '',
      postalcode: ''
    },
    openingHours: [{ day: '', openTime: '', closeTime: '' }]
  });

  const [currentStep, setCurrentStep] = useState(0); // Tracks the current step
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name === 'businessAddress' || name === 'businessCity' || name === 'businessPostalCode') {
      const field = name.replace('business', '').toLowerCase();
      setFormData((prevData) => {
        console.log('Updating business location:', field, value); // Debug log
        return {
          ...prevData,
          businessLocation: {
            ...prevData.businessLocation,
            [field]: value,
          },
        };
      });
    } else {
      setFormData((prevData) => {
        console.log('Updating field:', name, value); // Debug log
        return {
          ...prevData,
          [name]: value,
        };
      });
    }
  };
<<<<<<< HEAD
  
=======

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
>>>>>>> 7f9243b06fa245fc7f9fbd59a1c03af57de193c4

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

  const handleNext = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
  
    const userSpecificData = userType === 'business'
      ? {
          businessName: formData.businessName,
          businessLicense: formData.businessLicense,
          businessLocation: formData.businessLocation,
          openingHours: formData.openingHours,
        }
      : userType === 'driver'
      ? {
          driverLicense: formData.driverLicense,
          vehicle: {
            make: formData.vehicleMake,
            model: formData.vehicleModel,
            year: formData.vehicleYear,
            licensePlate: formData.licensePlate,
            insuranceProof: formData.insuranceProof,
          },
        }
      : {};
  
    try {
      const response = await fetch('http://localhost:5000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `mutation Register($username: String!, $email: String!, $password: String!) {}`,
          variables: {
            username: formData.username,
            email: formData.email,
            password: formData.password,
            ...userSpecificData,
          },
        }),
      });
  
      const result = await response.json();
      if (result.data && result.data.register) {
        alert('Registration successful!');
        navigate(`/login/${userType}`);
      } else {
        alert('Registration failed: ' + (result.errors?.[0]?.message || 'Unknown error.'));
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Registration failed due to an unexpected error.');
    }
  };
  

  const steps = [
    <UserDetails formData={formData} handleChange={handleChange} />,
    userType === 'business' ? (
      <BusinessDetails
        formData={formData}
        handleChange={handleChange}
        handleOpeningHoursChange={handleOpeningHoursChange}
        addOpeningHour={addOpeningHour}
        removeOpeningHour={removeOpeningHour}
      />
    ) : userType === 'driver' ? (
      <DriverDetails formData={formData} handleChange={handleChange} />
    ) : userType === 'admin' ? (
      <AdminDetails formData={formData} handleChange={handleChange} />
    ) : (
      <CustomerDetails formData={formData} handleChange={handleChange} />
    ),
    <ReviewAndSubmit
      formData={formData}
      userType={userType}
      handleBack={handleBack}
      handleRegister={handleRegister}
    />
  ];

 

  return (
    <Box sx={{ maxWidth: '600px', margin: 'auto', mt: 5 }}>
      <Typography variant="h4" textAlign="center" sx={{ mb: 3 }}>
        Step {currentStep + 1}: {userType.charAt(0).toUpperCase() + userType.slice(1)} Registration
      </Typography>
<<<<<<< HEAD
      {steps[currentStep]}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        {currentStep > 0 && (
          <Button variant="outlined" onClick={handleBack}>
            Back
          </Button>
        )}
        {currentStep < steps.length - 1 ? (
          <Button variant="contained" onClick={handleNext}>
            Next
          </Button>
        ) : (
          <Button variant="contained" onClick={handleRegister}>
            Submit
          </Button>
=======

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
>>>>>>> 7f9243b06fa245fc7f9fbd59a1c03af57de193c4
        )}
      </Box>
    </Box>
  );
}

export default Register;

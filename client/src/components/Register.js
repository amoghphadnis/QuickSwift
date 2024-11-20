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
        )}
      </Box>
    </Box>
  );
}

export default Register;

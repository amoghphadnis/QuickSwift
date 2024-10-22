import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography, Link, MenuItem } from '@mui/material';

function Register({ userType }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [profilePicture, setProfilePicture] = useState('');

  // Driver fields
  const [driverLicense, setDriverLicense] = useState('');
  const [vehicleMake, setVehicleMake] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleYear, setVehicleYear] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [insuranceProof, setInsuranceProof] = useState('');

  // Business fields
  const [businessLicense, setBusinessLicense] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [businessCity, setBusinessCity] = useState('');
  const [businessPostalCode, setBusinessPostalCode] = useState('');

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {

      const requestBody = {
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
            $businessLocation: LocationInput
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
              businessLocation: $businessLocation
            ) {
              id
              username
              email
              userType
              profilePicture
              phoneNumber
              driverLicense
              vehicle {
                make
                model
                year
                licensePlate
                insuranceProof
              }
              businessLicense
              businessType
              businessLocation {
                address
                city
                postalCode
              }
            }
          }
        `,
        variables: {
          username,
          email,
          password,
          userType,
          phoneNumber,
          profilePicture,
          driverLicense: userType === 'driver' ? driverLicense : null,
          vehicle: userType === 'driver' ? {
            make: vehicleMake,
            model: vehicleModel,
            year: parseInt(vehicleYear),
            licensePlate,
            insuranceProof
          } : null,
          businessLicense: userType === 'business' ? businessLicense : null,
          businessType: userType === 'business' ? businessType : null,
          businessLocation: userType === 'business' ? {
            address: businessAddress,
            city: businessCity,
            postalCode: businessPostalCode
          } : null,
        }
      };
  
      console.log('Request Body:', JSON.stringify(requestBody, null, 2)); // Add the console log here
  
      const response = await fetch('http://localhost:5000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
        
      });

      const result = await response.json();
      console.log('Response:', result); // Log the response to inspect error details

      if (result.data && result.data.register) {
        alert('Registration successful as ' + userType);
        navigate(`/login/${userType}`); // Redirect to the appropriate login page based on userType
      } else {
        alert('Registration failed');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Registration failed');
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
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Phone Number"
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Profile Picture URL"
          type="text"
          value={profilePicture}
          onChange={(e) => setProfilePicture(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />

        {userType === 'driver' && (
          <>
            <TextField
              label="Driver License"
              type="text"
              value={driverLicense}
              onChange={(e) => setDriverLicense(e.target.value)}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <TextField
              label="Vehicle Make"
              type="text"
              value={vehicleMake}
              onChange={(e) => setVehicleMake(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Vehicle Model"
              type="text"
              value={vehicleModel}
              onChange={(e) => setVehicleModel(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Vehicle Year"
              type="number"
              value={vehicleYear}
              onChange={(e) => setVehicleYear(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="License Plate"
              type="text"
              value={licensePlate}
              onChange={(e) => setLicensePlate(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Insurance Proof"
              type="text"
              value={insuranceProof}
              onChange={(e) => setInsuranceProof(e.target.value)}
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
              value={businessLicense}
              onChange={(e) => setBusinessLicense(e.target.value)}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <TextField
              label="Business Type"
              select
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
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
            <TextField
              label="Business Address"
              type="text"
              value={businessAddress}
              onChange={(e) => setBusinessAddress(e.target.value)}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <TextField
              label="Business City"
              type="text"
              value={businessCity}
              onChange={(e) => setBusinessCity(e.target.value)}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <TextField
              label="Business Postal Code"
              type="text"
              value={businessPostalCode}
              onChange={(e) => setBusinessPostalCode(e.target.value)}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
          </>
        )}

        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mb: 2 }}>
          Register
        </Button>
      </form>

      <Typography variant="body2">
        Already have an account?{' '}
        <Link href={`/login/${userType}`} variant="body2">
          Login as {userType.charAt(0).toUpperCase() + userType.slice(1)}
        </Link>
      </Typography>
    </Box>
  );
}

export default Register;

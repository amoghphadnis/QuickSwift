import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography, Link } from "@mui/material";
import UserDetails from "./Register/UserDetails";
import DriverDetails from "./Register/DriverDetails";
import BusinessDetails from "./Register/BusinessDetails";
import ReviewAndSubmit from "./Register/ReviewAndSubmit";

function Register({ userType }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phoneNumber: "",
    profilePicture: "",
    driverLicense: "",
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: "",
    licensePlate: "",
    insuranceProof: "",
    businessLicense: "",
    businessType: "",
    businessName: "",
    businessLogo: "",
    bannerImage: "",
    businessLocation: {
      address: "",
      city: "",
      postalcode: "",
    },
    openingHours: [{ day: "", openTime: "", closeTime: "" }],
  });

  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name.startsWith("business") && ["businessAddress", "businessCity", "businessPostalCode"].includes(name)) {
      // Fields related to businessLocation
      const locationField = name.replace("business", "").toLowerCase();
      setFormData((prevData) => ({
        ...prevData,
        businessLocation: { ...prevData.businessLocation, [locationField]: value },
      }));
    } else {
      // Other fields (e.g., businessName, businessLicense)
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({ ...prevData, [name]: reader.result }));
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const steps = [
    {
      component: (
        <UserDetails
          formData={formData}
          handleChange={handleChange}
          handleFileChange={handleFileChange} // Pass the handleFileChange function
        />
      ),
    },
    ...(userType === "driver"
      ? [
          {
            component: <DriverDetails formData={formData} handleChange={handleChange} />,
          },
        ]
      : []),
    ...(userType === "business"
      ? [
          {
            component: (
              <BusinessDetails
                formData={formData}
                handleChange={handleChange}
                handleFileChange={handleFileChange}
                addOpeningHour={() =>
                  setFormData((prevData) => ({
                    ...prevData,
                    openingHours: [...prevData.openingHours, { day: "", openTime: "", closeTime: "" }],
                  }))
                }
                handleOpeningHoursChange={(index, field, value) =>
                  setFormData((prevData) => {
                    const newOpeningHours = [...prevData.openingHours];
                    newOpeningHours[index][field] = value;
                    return { ...prevData, openingHours: newOpeningHours };
                  })
                }
              />
            ),
          },
        ]
      : []),
    { component: <ReviewAndSubmit formData={formData} userType={userType} /> },
  ];
  

  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Define the GraphQL mutation
    const mutation = `
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
          bannerImage: $bannerImage,
          businessLocation: $businessLocation,
          openingHours: $openingHours
        ) {
          id
          username
          email
          userType
        }
      }
    `;
  
    // Prepare variables for the mutation
    const variables = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      userType,
      phoneNumber: formData.phoneNumber,
      profilePicture: formData.profilePicture,
      driverLicense: userType === "driver" ? formData.driverLicense : null,
      vehicle:
        userType === "driver"
          ? {
              make: formData.vehicleMake,
              model: formData.vehicleModel,
              year: parseInt(formData.vehicleYear, 10),
              licensePlate: formData.licensePlate,
              insuranceProof: formData.insuranceProof,
            }
          : null,
      businessLicense: userType === "business" ? formData.businessLicense : null,
      businessType: userType === "business" ? formData.businessType : null,
      businessName: userType === "business" ? formData.businessName : null,
      businessLogo: userType === "business" ? formData.businessLogo : null,
      bannerImage: userType === "business" ? formData.bannerImage : null,
      businessLocation:
        userType === "business" ? formData.businessLocation : null,
      openingHours: userType === "business" ? formData.openingHours : null,
    };
  
    try {
      // Send the GraphQL request
      const response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: mutation, variables }),
      });
  
      const result = await response.json();
  
      // Handle the response
      if (result.data && result.data.register) {
        alert("Registration successful!");
        navigate(`/login/${userType}`);
      } else {
        console.error("Error:", result.errors);
        alert("Registration failed: " + (result.errors?.[0]?.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An unexpected error occurred.");
    }
  };  

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 2,
      }}
    >
      <Typography variant="h4" sx={{ mb: 4 }}>
        Register as {userType.charAt(0).toUpperCase() + userType.slice(1)}
      </Typography>

      <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "500px" }}>
        {steps[currentStep].component}

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
          <Button
            variant="contained"
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            Back
          </Button>
          {currentStep === steps.length - 1 ? (
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          ) : (
            <Button variant="contained" color="primary" onClick={handleNext}>
              Next
            </Button>
          )}
        </Box>
      </form>

      <Typography sx={{ mt: 2 }}>
        Already have an account? <Link href={`/login/${userType}`}>Log In</Link>
      </Typography>
    </Box>
  );
}

export default Register;
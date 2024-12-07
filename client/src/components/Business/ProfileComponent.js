import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { Box, Typography, CircularProgress, Avatar, Grid } from '@mui/material';

const ProfileComponent = () => {
  const { userType, userId } = useContext(UserContext);
  const [user, setUser] = useState(null);

  console.log('userId..!!', userId)
  console.log('userType..!!', userType)

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No token found. Please log in.');
        return;
      }
      try {
        const response = await fetch('http://localhost:5000/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Pass the token in the header
          },
          body: JSON.stringify({
            query: `
                      query GetUser($id: ID!, $userType: String!) {
                        getUser(id: $id, userType: $userType) {
                          username
                          email
                          userType
                          profilePicture
                          businessInfo{
                             businessLogo
                             bannerImage
                             businessName
                          }
                        }
                      }
                    `,
            variables: {
              id: userId,    // Use userId from the params
              userType: userType,  // Pass userType from the context
            },
          }),
        });

        const result = await response.json();
        console.log('profile...result..!!', result)
        if (result.data && result.data.getUser) {
          setUser(result.data.getUser);

        } else {
          throw new Error('Failed to fetch user data');
        }
      } catch (err) {
        throw new Error('Failed to fetch user data');
      }

    }
    fetchUserData();

  }, [userId, userType])
  return (
    <Box sx={{ padding: '20px', maxWidth: '1000px', margin: '0 auto', backgroundColor: '#f9f9f9', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>

      {user ? (
        <Grid container spacing={4}>
          {/* Business Banner Image */}
          {user.businessInfo.bannerImage && (
            <Grid item xs={12}>
              <Box
                component="img" // Allows Box to act as an img element
                src={user.businessInfo.bannerImage}
                alt="Business Image"
                sx={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  margin: '0 auto',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                  borderRadius: '8px',
                }}
              />
            </Grid>
          )}

          {/* Profile Information */}
          <Grid item xs={12}>
            <Box
              sx={{
                padding: '20px',
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                marginBottom: '20px',
              }}
            >
              <Typography
                variant="h5"
                component="h3"
                gutterBottom
                sx={{ fontWeight: 'bold', color: '#333', marginBottom: '10px', textAlign: 'center' }}
              >
                Profile Information
              </Typography>
              <Box sx={{ paddingLeft: '10px' }}>
                <Typography variant="body1" sx={{ marginBottom: '8px', color: '#555' }}>
                  <strong>Username:</strong> {user.username}
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: '8px', color: '#555' }}>
                  <strong>Email:</strong> {user.email}
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: '8px', color: '#555' }}>
                  <strong>User Type:</strong> {user.userType}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Profile Picture */}
          {user.profilePicture && (
            <Grid item xs={12} sm={6} textAlign="center">
              <Typography variant="h6">Profile Picture</Typography>
              <Avatar
                src={user.profilePicture}
                alt="Profile"
                sx={{ width: 200, height: 200, margin: '10px auto', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}
              />
            </Grid>
          )}

          {/* Business Logo */}
          {user.businessInfo.businessLogo && (
            <Grid item xs={12} sm={6} textAlign="center">
              <Typography variant="h6">Business Logo</Typography>
              <Avatar
                src={user.businessInfo.businessLogo}
                alt="Business Logo"
                sx={{ width: 200, height: 200, margin: '10px auto', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}
              />
            </Grid>
          )}


        </Grid>
      ) : (
        <Box sx={{ textAlign: 'center', marginTop: '20px' }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ marginTop: '10px' }}>
            Loading user data...
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ProfileComponent;
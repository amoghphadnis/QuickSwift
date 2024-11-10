import React, { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { jwtDecode } from 'jwt-decode';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Grid,
  Avatar,
  Box,
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import PersonIcon from '@mui/icons-material/Person';

const AdminUsers = () => {
  const { setUserType } = useContext(UserContext);
  const navigate = useNavigate();
  const [users, setUsers] = useState(null);

  useEffect(() => {
    const fetchAllUserData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          if (decodedToken.exp < currentTime) {
            console.log('Token expired');
            handleLogout();
          }
          const response = await fetch('http://localhost:5000/graphql', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              query: `
                query GetAllUsers {
                  getAllUsers {
                    id
                    userId
                    username
                    email
                    userType
                    status
                    driverInfo {
                      driverLicense
                      vehicle {
                        make
                        model
                        year
                        licensePlate
                      }
                    }
                    businessInfo {
                      businessLicense
                      businessType
                      businessLocation {
                        address
                        city
                        postalcode
                      }
                    }
                  }
                }
              `,
            }),
          });
          const result = await response.json();
          if (result.errors) {
            console.error('Error fetching users:', result.errors);
            return [];
          }
          setUsers(result.data.getAllUsers);
        } catch (error) {
          console.error('Failed to decode token:', error);
          handleLogout();
        }
      }
    };
    fetchAllUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUserType(null);
    navigate('/login');
  };

  const approveUser = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found, user not authenticated.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: `
            mutation ApproveUser($id: ID!) {
              approveUser(id: $id) {
                id
                userId
                username
                status
              }
            }
          `,
          variables: { id },
        }),
      });

      const data = await response.json();
      if (data.errors) {
        console.error('Error approving user:', data.errors);
        return;
      }

      console.log('User approved successfully:', data.data.approveUser);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, status: 'active' } : user
        )
      );
    } catch (error) {
      console.error('Error approving user:', error);
    }
  };

  const rejectUser = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found, user not authenticated.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: `
            mutation RejectUser($id: ID!) {
              rejectUser(id: $id) {
                id
                userId
                status
              }
            }
          `,
          variables: { id },
        }),
      });

      const data = await response.json();
      if (data.errors) {
        console.error('Error rejecting user:', data.errors);
        return;
      }

      console.log('User rejected successfully:', data.data.rejectUser);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, status: 'inactive' } : user
        )
      );
    } catch (error) {
      console.error('Error rejecting user:', error);
    }
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Manage Users
      </Typography>
      <Grid container spacing={3}>
        {users && users.length > 0 ? (
          users.map((user) => (
            <Grid item xs={12} sm={6} md={4} key={user.userId}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                      {user.userType === 'business' ? (
                        <BusinessIcon />
                      ) : user.userType === 'driver' ? (
                        <DriveEtaIcon />
                      ) : (
                        <PersonIcon />
                      )}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">{user.username}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {user.userType.charAt(0).toUpperCase() + user.userType.slice(1)}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography>Email: {user.email}</Typography>
                  <Typography>Status: {user.status}</Typography>

                  {user.userType === 'business' && user.businessInfo && (
                    <Box mt={2}>
                      <Typography variant="subtitle1">Business Details:</Typography>
                      <Typography variant="body2">License: {user.businessInfo.businessLicense}</Typography>
                      <Typography variant="body2">Type: {user.businessInfo.businessType}</Typography>
                      <Typography variant="body2">
                        Location: {user.businessInfo.businessLocation.address}, {user.businessInfo.businessLocation.city},{' '}
                        {user.businessInfo.businessLocation.postalcode}
                      </Typography>
                    </Box>
                  )}

                  {user.userType === 'driver' && user.driverInfo && (
                    <Box mt={2}>
                      <Typography variant="subtitle1">Driver Details:</Typography>
                      <Typography variant="body2">License: {user.driverInfo.driverLicense}</Typography>
                      <Typography variant="body2">
                        Vehicle: {user.driverInfo.vehicle?.make} {user.driverInfo.vehicle?.model} ({user.driverInfo.vehicle?.year})
                      </Typography>
                      <Typography variant="body2">License Plate: {user.driverInfo.vehicle?.licensePlate}</Typography>
                    </Box>
                  )}
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => approveUser(user.id)}
                    sx={{ width: '50%' }}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => rejectUser(user.id)}
                    sx={{ width: '50%' }}
                  >
                    Reject
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography>No users found.</Typography>
        )}
      </Grid>
    </Box>
  );
};

export default AdminUsers;

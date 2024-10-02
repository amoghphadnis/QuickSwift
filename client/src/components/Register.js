import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography, Link } from '@mui/material';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: `
            mutation Register($username: String!, $email: String!, $password: String!) {
              register(username: $username, email: $email, password: $password) {
                id
                username
                email
              }
            }
          `,
          variables: { username, email, password }
        })
      });

      const result = await response.json();
      if (result.data && result.data.register) {
        alert('Registration successful');
        navigate('/login');
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
        Register Now
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
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mb: 2 }}>
          Register
        </Button>
      </form>

      <Typography variant="body2">
        Already have an account?{' '}
        <Link href="/login" variant="body2">
          Login
        </Link>
      </Typography>
    </Box>
  );
}

export default Register;

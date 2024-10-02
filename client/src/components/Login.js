import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography, Link } from '@mui/material';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: `
            mutation Login($email: String!, $password: String!) {
              login(email: $email, password: $password) {
                token
                userId
              }
            }
          `,
          variables: { email, password }
        })
      });

      const result = await response.json();
      if (result.errors) {
        console.error('GraphQL errors:', result.errors);
      }
      if (result.data && result.data.login) {
        localStorage.setItem('token', result.data.login.token);
        navigate(`/profile/${result.data.login.userId}`);
      } else {
        alert('Login failed');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Login failed');
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
        Welcome Back
      </Typography>

      <form onSubmit={handleLogin} style={{ width: '100%', maxWidth: '400px' }}>
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
          Login
        </Button>
      </form>

      <Link href="#" variant="body2" sx={{ mb: 2 }}>
        Forgot Password
      </Link>

      <Typography variant="body2">
        Don’t have an account?{' '}
        <Link href="/register" variant="body2">
          Sign Up Now
        </Link>
      </Typography>
    </Box>
  );
}

export default Login;

import React, { useState ,useContext} from 'react';
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography, Link,Modal} from '@mui/material';
import { UserContext } from './context/UserContext';

function Login({ userType }) {  // Receive userType as a prop
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();
  const { setUserType, setUserId } = useContext(UserContext); // Access setUserType and setUserId from context

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
            mutation Login($email: String!, $password: String!, $userType: String!) {
              login(email: $email, password: $password, userType: $userType) {
                token
                userId
                userType
              }
            }
          `,
          variables: { email, password, userType }
        })
      });

      const result = await response.json();
      if (result.errors) {
        console.error('GraphQL errors:', result.errors);
        alert(JSON.stringify(result.errors[0].message))
      }
      if (result.data && result.data.login) {
        localStorage.setItem('token', result.data.login.token);
        setUserType(result.data.login.userType);
        setUserId(result.data.login.userId);
        if (userType === 'admin') {
          navigate(`/admin/dashboard`);
        }
        else if(userType ==='customer'){
          navigate(`/customer/home`);
        }
        else if(userType ==='business'){
          navigate(`/business/dashboard`);
        }
        
      } 
    } catch (err) {
      console.error('Error:', err);
      alert('Login failed');
    }
  };

  const handleForgotPassword = async () => {
    try {
      const response = await fetch('http://localhost:5000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            mutation ForgotPassword($email: String!) {
              forgotPassword(email: $email)
            }
          `,
          variables: { email: forgotEmail },
        }),
      });

      const result = await response.json();
      if (result.errors) {
        setMessage(result.errors[0].message);
      } else {
        setMessage('Password reset email sent. Please check your inbox.');
        setShowForgotPasswordModal(false);
      }
    } catch (err) {
      console.error(err);
      setMessage('Error sending password reset email.');
    }
  }

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
        Login as {userType.charAt(0).toUpperCase() + userType.slice(1)} {/* Display userType dynamically */}
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

      <Link onClick={() => setShowForgotPasswordModal(true)} style={{ cursor: 'pointer' }} variant="body2" sx={{ mb: 2 }}>
        Forgot Password
      </Link>

      <Typography variant="body2">
        Don’t have an account?{' '}
        <Link href={`/register/${userType}`} variant="body2">
          Sign Up Now as {userType.charAt(0).toUpperCase() + userType.slice(1)}
        </Link>
      </Typography>


      <Modal open={showForgotPasswordModal} onClose={() => setShowForgotPasswordModal(false)}>
        <Box sx={{ padding: 4, backgroundColor: 'white', margin: 'auto', mt: 10, width: '300px' }}>
          <Typography variant="h6">Forgot Password</Typography>
          <TextField
            label="Email"
            type="email"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <Button variant="contained" onClick={handleForgotPassword} fullWidth>
            Send Reset Email
          </Button>
          {message && <Typography variant="body2" sx={{ mt: 2 }}>{message}</Typography>}
        </Box>
      </Modal>

    </Box>
  );
}

export default Login;

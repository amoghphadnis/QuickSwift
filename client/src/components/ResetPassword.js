import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography } from "@mui/material";

function ResetPassword() {
  const { token,userId } = useParams(); // Extract the token from the URL
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();


    try {
      const response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            query: `
              mutation ResetPassword($userId: ID!, $token: String!, $newPassword: String!) {
                resetPassword(userId: $userId, token: $token, newPassword: $newPassword)
              }
            `,
            variables: { userId, token, newPassword },
          }),
      });

      const result = await response.json();
      if (result.data.resetPassword) {
        setSuccessMessage("Password has been reset successfully!");
        setErrorMessage("");
        setTimeout(() => navigate("/login"), 2000); // Redirect to login after success
      } else {
        setErrorMessage("Failed to reset password.");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        padding: 2,
      }}
    >
      <Typography variant="h4" sx={{ mb: 4 }}>
        Reset Password
      </Typography>

      {successMessage && (
        <Typography variant="body1" color="success.main" sx={{ mb: 2 }}>
          {successMessage}
        </Typography>
      )}
      {errorMessage && (
        <Typography variant="body1" color="error.main" sx={{ mb: 2 }}>
          {errorMessage}
        </Typography>
      )}

      <form onSubmit={handleResetPassword} style={{ width: "100%", maxWidth: "400px" }}>
        <TextField
          label="New Password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
       
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Reset Password
        </Button>
      </form>
    </Box>
  );
}

export default ResetPassword;

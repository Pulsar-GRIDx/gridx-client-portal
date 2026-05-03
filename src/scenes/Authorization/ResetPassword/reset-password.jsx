import React, { useState } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useLocation } from 'react-router-dom';

/**
 * @module Reset_Password
 */

/**
 * ResetPassword component handles the process of resetting a user's password.
 *
 * @component
 * @example
 * return (
 *   <ResetPassword />
 * )
 */
export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');
  const [PassReset, setPassReset] = useState({
    temporary_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [PassResetErrors, setPassResetErrors] = useState({
    temporary_password: "",
    new_password: "",
    confirm_password: "",
  });

  /**
   * Handles input changes and updates the PassReset state.
   *
   * @param {Object} event - The input change event
   */
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setPassReset({
      ...PassReset,
      [name]: value,
    });
  };

  /**
   * Validates the form inputs for resetting the password.
   *
   * @returns {boolean} - True if the form is valid, false otherwise.
   */
  const validateForm = () => {
    const errors = {};
    if (!PassReset.temporary_password.trim()) {
      errors.temporary_password = "Temporary password is required";
    }
    if (!PassReset.new_password.trim()) {
      errors.new_password = "New Password is required";
    } else if (
      !PassReset.new_password.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/
      )
    ) {
      errors.new_password =
        "Password must be 8-24 characters and include at least one lowercase letter, one uppercase letter, one digit, and one special character (!@#$%).";
    }
    if (!PassReset.confirm_password.trim()) {
      errors.confirm_password = "Confirm Password is required";
    } else if (PassReset.new_password !== PassReset.confirm_password) {
      errors.confirm_password = "Passwords don't match";
    }

    setPassResetErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Handles form submission for resetting the password.
   *
   * @param {Object} e - The form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (validateForm()) {
      try {
        const response = await axios.post(
          `https://backend1.gridxmeter.com/reset-password?token=${token}`,
          { PassReset },
          
        );
  
        if (response.ok) {
          navigate("/auth");
        }
      } catch (err) {
        console.error("Error sending request:", err);
      }
    } else {
      console.log("Form is invalid. Please correct the errors.");
    }
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        background: "-webkit-linear-gradient(to right, #021B79, #0575E6)",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <CssBaseline />
      <Box
        sx={{
          width: '100%',
          maxWidth: '400px',
          p: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Reset Password
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="temporary_password"
            label="Temporary password"
            name="temporary_password"
            type="password"
            value={PassReset.temporary_password}
            onChange={handleInputChange}
            error={!!PassResetErrors.temporary_password}
            helperText={PassResetErrors.temporary_password}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="new_password"
            label="New Password"
            type="password"
            id="new_password"
            value={PassReset.new_password}
            onChange={handleInputChange}
            error={!!PassResetErrors.new_password}
            helperText={PassResetErrors.new_password}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="confirm_password"
            label="Confirm Password"
            name="confirm_password"
            type="password"
            autoFocus
            value={PassReset.confirm_password}
            onChange={handleInputChange}
            error={!!PassResetErrors.confirm_password}
            helperText={PassResetErrors.confirm_password}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Reset
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

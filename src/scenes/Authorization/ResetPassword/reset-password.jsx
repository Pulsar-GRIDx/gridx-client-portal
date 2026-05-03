import React, { useState } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";
import { customerAuthAPI } from "../../../services/api";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    pin: "",
    new_password: "",
    confirm_password: "",
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.email.trim()) {
      errs.email = "Email is required";
    }
    if (!formData.pin.trim()) {
      errs.pin = "Verification code is required";
    }
    if (!formData.new_password.trim()) {
      errs.new_password = "New Password is required";
    } else if (
      !formData.new_password.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/
      )
    ) {
      errs.new_password =
        "Password must be 8-24 characters and include at least one lowercase letter, one uppercase letter, one digit, and one special character (!@#$%).";
    }
    if (!formData.confirm_password.trim()) {
      errs.confirm_password = "Confirm Password is required";
    } else if (formData.new_password !== formData.confirm_password) {
      errs.confirm_password = "Passwords don't match";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    if (validateForm()) {
      try {
        await customerAuthAPI.resetPassword(
          formData.email,
          formData.pin,
          formData.new_password,
          formData.new_password
        );
        navigate("/");
      } catch (err) {
        setApiError(err.message || "Password reset failed. Please try again.");
      }
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
        {apiError && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {apiError}
          </Typography>
        )}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="pin"
            label="Verification Code"
            name="pin"
            value={formData.pin}
            onChange={handleInputChange}
            error={!!errors.pin}
            helperText={errors.pin}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="new_password"
            label="New Password"
            type="password"
            id="new_password"
            value={formData.new_password}
            onChange={handleInputChange}
            error={!!errors.new_password}
            helperText={errors.new_password}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="confirm_password"
            label="Confirm Password"
            name="confirm_password"
            type="password"
            value={formData.confirm_password}
            onChange={handleInputChange}
            error={!!errors.confirm_password}
            helperText={errors.confirm_password}
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

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { CssBaseline, Grid, TextField } from "@mui/material";
import axios from "axios";

/**
 * @module Forgot_Password
 */

/**
 * ForgotPassword component renders a form for users to request a password reset.
 * It sends the user's email to the server to initiate the password reset process.
 * 
 * @component
 */
function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  /**
   * Handles input change event for the email field.
   * 
   * @param {Event} event - The input change event
   */
  const handleInputChange = (event) => {
    setEmail(event.target.value);
  };

  /**
   * Handles form submission for the password reset request.
   * Validates the email format and sends a POST request to the server.
   * Displays an error message if the email is invalid or not found.
   * 
   * @param {Event} e - The form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (!email.match(emailFormat)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      const response = await axios.post(
        "https://backend1.gridxmeter.com/forgot-password",
        { email }
      );

      if (!response.data.exists) {
        navigate("/auth");
      } else {
        setError("Email not found in the database.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("An error occurred while processing your request.");
    }
  };

  return (
    <>
      <CssBaseline/>
      <Grid
        container
        spacing={2}
        sx={{
          background:
            "-webkit-linear-gradient(to right, #021B79, #0575E6)", /* Chrome 10-25, Safari 5.1-6 */
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <Grid item xs={12} sm={10} md={8} lg={8} xl={8}>
          <Box
            borderRadius="lg"
            py={2}
            textAlign="center"
          >
            <Typography variant="h3" fontWeight="medium" color="white" mt={1}>
              Reset Password
            </Typography>
            <Typography display="block" variant="button" color="white" my={1}>
              You will receive an e-mail to reset your password
            </Typography>
          </Box>
          <Box pt={4} pb={3} px={3}>
            <form onSubmit={handleSubmit}>
              <TextField
                type="email"
                label="Email"
                variant="standard"
                fullWidth
                value={email}
                onChange={handleInputChange}
                margin="normal"
                required
                id="email"
                autoComplete="current-password"
                error={!!error}
                helperText={error}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3 }}
              >
                Reset
              </Button>
            </form>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

export default ForgotPassword;

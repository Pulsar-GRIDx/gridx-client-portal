import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { CssBaseline, Grid, TextField } from "@mui/material";
import { customerAuthAPI } from "../../../services/api";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleInputChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (!email.match(emailFormat)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      await customerAuthAPI.forgotPassword(email);
      setSuccess(true);
      setError("");
    } catch (error) {
      if (error.message.includes("not found")) {
        setError("Email not found in the database.");
      } else {
        setError("An error occurred while processing your request.");
      }
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
            "-webkit-linear-gradient(to right, #021B79, #0575E6)",
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
              {success
                ? "A verification code has been sent to your email."
                : "You will receive a verification code to reset your password"}
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
                error={!!error}
                helperText={error}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3 }}
                disabled={success}
              >
                {success ? "Code Sent" : "Reset"}
              </Button>
            </form>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

export default ForgotPassword;

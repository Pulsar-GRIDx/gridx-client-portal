import React, { useEffect, useState } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

/**
 * @module Routes
 */

/**
 * NotFound component displays a 404 error page and redirects to the home page after a countdown.
 */
const NotFound = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(30);

  // Countdown effect to update countdown state every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    // Redirect to home page after 30 seconds
    const redirectTimer = setTimeout(() => {
      navigate("/");
    }, 30000);

    // Cleanup timers on component unmount
    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
        bgcolor: "background.default",
        color: "text.primary",
        p: 2,
      }}
    >
      {/* 404 Error Heading */}
      <Typography variant="h1" color="error" gutterBottom>
        404
      </Typography>
      {/* Error message */}
      <Typography variant="h3" paragraph>
        Oops! The page you're looking for could not be found.
      </Typography>
      {/* Countdown message */}
      <Typography variant="h6" paragraph>
        Redirecting to the home page in {countdown} seconds...
      </Typography>
      {/* Progress indicator */}
      <CircularProgress variant="determinate" value={(30 - countdown) * 100 / 30} />
      {/* Button to navigate to home page */}
      <Button
        variant="contained"
        component={Link}
        to="/"
        color="primary"
        size="large"
        sx={{ mt: 2 }}
      >
        Go to Home Now
      </Button>
    </Box>
  );
};

export default NotFound;

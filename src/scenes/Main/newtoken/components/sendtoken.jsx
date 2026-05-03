import React, { useState } from "react";
import {
  Button,
  Card,
  TextField,
  Box,
  Typography,
  CardHeader,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { tokens } from "../../../../theme/theme";
import SetNotifications from "../../../../components/setNotifications";

/**
 * SendToken component allows users to send an STS token to a meter.
 * It handles token validation, displays a dialog for confirmation,
 * and sends the token via a POST request to the backend API.
 *
 * @memberof MeterTokenDashBoard.MeterTokenDashBoard_components
 * @component
 * @returns {JSX.Element} The rendered SendToken component.
 */
const SendToken = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [token, setToken] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [isTokenSent, setIsTokenSent] = useState(false);

  /**
   * Handles changes in the token input field.
   *
   * @param {Object} event - The event object containing the new value.
   */
  const handleTokenChange = (event) => {
    const rawValue = event.target.value.replace(/\D/g, "");
    const formattedValue = rawValue
      ? rawValue
          .match(/.{1,4}/g)
          .map((group) => group.replace(/\s/g, ""))
          .join("    ")
          .substr(0, 36)
      : "";

    setToken(formattedValue);
  };

  /**
   * Opens the confirmation dialog if the token is valid.
   */
  const handleOpenDialog = () => {
    if (validateToken(token)) {
      setErrorText("");
      setOpenDialog(true);
    } else {
      setErrorText("Invalid token. Please enter a 26-digit integer.");
    }
  };

  /**
   * Closes the confirmation dialog.
   */
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  /**
   * Retrieves the access token from session storage.
   *
   * @returns {string} The access token.
   */
  const getAccessToken = () => {
    const token = sessionStorage.getItem("Token");
    return token;
  };

  /**
   * Sends the validated token to the backend API.
   */
  const handleSendToken = async () => {
    if (validateToken(token)) {
      setErrorText("");
      setOpenDialog(false);
      setLoading(true);

      const apiUrl = `https://backend1.gridxmeter.com/update-token`;
      const cleanedToken = token.replace(/\s/g, "");

      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            authorization: `${getAccessToken()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(cleanedToken),
        });

        if (response.ok) {
          setIsTokenSent(true);
          SetNotifications("Units Added to the meter", "Recommended", "0");
        } else {
          console.error("Failed to send token");
        }
      } catch (error) {
        console.error("Error sending token:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setErrorText("Invalid token. Please enter a 26-digit integer.");
    }
  };

  /**
   * Validates the token format.
   *
   * @param {string} value - The token value to validate.
   * @returns {boolean} True if the token is valid, false otherwise.
   */
  const validateToken = (value) => {
    const cleanedValue = value.replace(/\s/g, "");
    const isValid = /^\d{20}$/.test(cleanedValue);
    return isValid;
  };

  return (
    <>
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: `${colors.primaryT[400]}`,
          margin: "15px",
        }}
      >
        <CardHeader
          sx={{
            backgroundColor: `${colors.primaryT[300]}`,
            width: "100%",
          }}
          title="Send STS Token To Meter"
        />
        <Box
          sx={{
            maxWidth: 375,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            margin: 7,
          }}
        >
          <Typography variant="h4">Enter Meter Token</Typography>
          <Box component="form">
            <TextField
              id="token-input"
              label="Enter Token"
              variant="standard"
              sx={{ width: 328 }}
              value={token}
              onChange={handleTokenChange}
              error={errorText !== ""}
              helperText={errorText}
            />
            {loading ? (
              <CircularProgress
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 2,
                }}
              />
            ) : (
              <Button
                variant="contained"
                sx={{
                  background: `${colors.primaryT[300]}`,
                  color: `${colors.primary[100]}`,
                  height: 40,
                  width: 328,
                  marginTop: 2,
                }}
                onClick={handleOpenDialog}
              >
                Send Token
              </Button>
            )}
          </Box>
        </Box>
      </Card>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to send the STS token?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSendToken} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      {isTokenSent && (
        <Typography variant="h6" sx={{ margin: 2 }}>
          Token sent successfully!
        </Typography>
      )}
    </>
  );
};

export default SendToken;

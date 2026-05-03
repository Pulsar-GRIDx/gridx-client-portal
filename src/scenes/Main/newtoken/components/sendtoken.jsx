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
import { meterControlAPI } from "../../../../services/api";

const SendToken = ({ drn }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [token, setToken] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [isTokenSent, setIsTokenSent] = useState(false);

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

  const handleOpenDialog = () => {
    if (validateToken(token)) {
      setErrorText("");
      setOpenDialog(true);
    } else {
      setErrorText("Invalid token. Please enter a 20-digit integer.");
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSendToken = async () => {
    if (!validateToken(token)) {
      setErrorText("Invalid token. Please enter a 20-digit integer.");
      return;
    }
    if (!drn) {
      setErrorText("No meter DRN found. Please log in again.");
      return;
    }

    setErrorText("");
    setOpenDialog(false);
    setLoading(true);
    const cleanedToken = token.replace(/\s/g, "");

    try {
      await meterControlAPI.sendToken(drn, cleanedToken);
      setIsTokenSent(true);
      SetNotifications("Units Added to the meter", "Recommended", "0");
    } catch (error) {
      console.error("Error sending token:", error);
      setErrorText("Failed to send token. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const validateToken = (value) => {
    const cleanedValue = value.replace(/\s/g, "");
    return /^\d{20}$/.test(cleanedValue);
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

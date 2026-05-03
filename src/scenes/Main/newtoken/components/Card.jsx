import React, { useEffect, useState } from "react";
import {
  Paper,
  Box,
  Typography,
  Switch,
  Button,
  useTheme,
} from "@mui/material";
import { tokens } from "../../../../theme/theme";
import PropTypes from "prop-types";
import ConfirmDialog from "../../../../components/ConfirmDialog";

/**
 * DisplayCard component displays a card with a title, switch, and save button.
 * It allows toggling a state and saving the state using provided API endpoints.
 *
 * @memberof MeterTokenDashBoard.MeterTokenDashBoard_components
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.Title - The title of the card.
 * @param {string} props.APIPost - The API endpoint for POST requests.
 * @param {string} props.APIGet - The API endpoint for GET requests.
 * @param {React.ElementType} props.Icon - The icon component to display.
 * @returns {JSX.Element} The rendered DisplayCard component.
 */
const DisplayCard = ({ Title, APIPost, APIGet, Icon }) => {
  const [open, setOpen] = useState(false);
  const [recall, setRecall] = useState(false);
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState("0"); // Assuming initial state is "0"
  const Reason = "Meter User";
  let colorState = "blue";
  let colorStateBG = "blue";

  // Dynamic theming using MUI theme tokens
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  colorState = state === "1" ? colors.green[600] : colors.red[500];
  colorStateBG = state === "1" ? colors.greenT[600] : colors.redT[500];

  // Function to retrieve access token from session storage
  const getAccessToken = () => {
    const token = sessionStorage.getItem("Token");
    return token;
  };

  // Handler for switch toggle
  const handleChecked = () => {
    const newState = !checked;
    setChecked(newState);
  };

  // Opens the confirmation dialog
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Closes the confirmation dialog
  const handleClose = () => {
    setOpen(false);
  };

  // Confirms the action and performs the toggle
  const handleConfirm = () => {
    console.log("Action confirmed.");
    console.log("Action confirmed with state", checked);
    handleToggle();
    setOpen(false);
  };

  // Fetches initial data from API on component mount
  const fetchData = async () => {
    try {
      const response = await fetch(APIGet, {
        method: "GET",
        headers: {
          authorization: `${getAccessToken()}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setState(data);
      setChecked(data === "1");
      console.log(data);
    } catch (error) {
      console.error("Meter state fetch error:", error);
    }
  };

  // Fetch initial data on component mount
  useEffect(() => {
    fetchData();
  }, [recall]);

  // Handles the toggle action and updates the server
  const handleToggle = async () => {
    setLoading(true);
    const newState = checked ? 1 : 0;
    const meterdata = {
      state: newState,
      reason: Reason,
      processed: 0,
    };

    try {
      const response = await fetch(APIPost, {
        method: "POST",
        headers: {
          authorization: `${getAccessToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(meterdata),
      });

      if (response.ok) {
        setState(response.state);
        setChecked(response.state === 1);
      }
    } catch (error) {
      console.error("Error sending token:", error);
    } finally {
      setLoading(false);
      setRecall(checked);
    }
  };

  return (
    <Paper
      sx={{
        minWidth: 275,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 2,
        margin: 3,
        position: "relative",
        backgroundColor: colors.primaryT[400],
      }}
    >
      {/* Icon and Title section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        {/* Rotated circle with icon */}
        <Box
          sx={{
            position: "absolute",
            top: -30,
            left: "10%",
            transform: "translateX(-50%) rotate(45deg)",
            width: "60px",
            height: "60px",
            backgroundColor: colors.primaryT[300],
            border: "3px solid",
            borderColor: colorState,
            borderRadius: "100%",
            overflow: "hidden",
            color: colorState,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              transform: "rotate(-45deg)", // Counter-rotate text
            }}
          >
            <Icon
              sx={{
                fontSize: 70,
                color: colorState,
                backgroundColor: colorStateBG,
                padding: 1,
              }}
            />
          </Box>
        </Box>
        {/* Title and Switch */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Box sx={{ textAlign: "right" }}>
            <Typography variant="h5">{Title}</Typography>
          </Box>
          {/* Switch section */}
          <Box
            display="flex"
            alignItems="center"
            flexDirection="row"
            justifyContent="space-around"
          >
            <Typography variant="subtitle1">Off</Typography>
            <Switch
              checked={checked}
              onChange={(e) => {
                handleChecked();
              }}
              inputProps={{ "aria-label": "controlled" }}
              sx={{
                color: colorState,
              }}
            />
            <Typography variant="subtitle1">On</Typography>
          </Box>
        </Box>
      </Box>
      {/* Save Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleClickOpen}
        sx={{ width: "90%" }}
      >
        Save
      </Button>
      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={open}
        handleClose={handleClose}
        handleConfirm={handleConfirm}
      />
    </Paper>
  );
};

DisplayCard.propTypes = {
  /**
   * The title of the card.
   */
  Title: PropTypes.string.isRequired,
  /**
   * The API endpoint for POST requests.
   */
  APIPost: PropTypes.string.isRequired,
  /**
   * The API endpoint for GET requests.
   */
  APIGet: PropTypes.string.isRequired,
  /**
   * The icon component to display.
   */
  Icon: PropTypes.elementType.isRequired,
};

export default DisplayCard;

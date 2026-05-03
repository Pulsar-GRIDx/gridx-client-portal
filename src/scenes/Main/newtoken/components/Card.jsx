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
import { meterDataAPI, meterControlAPI } from "../../../../services/api";

const DisplayCard = ({ Title, drn, controlType, Icon }) => {
  const [open, setOpen] = useState(false);
  const [recall, setRecall] = useState(false);
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState("0");
  const Reason = "Customer Portal";

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  let colorState = state === "1" ? colors.green[600] : colors.red[500];
  let colorStateBG = state === "1" ? colors.greenT[600] : colors.redT[500];

  const handleChecked = () => {
    setChecked(!checked);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    handleToggle();
    setOpen(false);
  };

  const fetchData = async () => {
    if (!drn) return;
    try {
      const getFn = controlType === "heater"
        ? meterDataAPI.getHeaterState
        : meterDataAPI.getMainsState;
      const data = await getFn(drn);
      setState(data);
      setChecked(data === "1" || data === 1);
    } catch (error) {
      console.error("Meter state fetch error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [recall, drn]);

  const handleToggle = async () => {
    if (!drn) return;
    setLoading(true);
    const newState = checked ? 1 : 0;

    try {
      const setFn = controlType === "heater"
        ? meterControlAPI.setHeaterControl
        : meterControlAPI.setMainsControl;
      await setFn(drn, newState, Reason);
      setState(String(newState));
      setChecked(newState === 1);
    } catch (error) {
      console.error("Error toggling state:", error);
    } finally {
      setLoading(false);
      setRecall(!recall);
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
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
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
              transform: "rotate(-45deg)",
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
          <Box
            display="flex"
            alignItems="center"
            flexDirection="row"
            justifyContent="space-around"
          >
            <Typography variant="subtitle1">Off</Typography>
            <Switch
              checked={checked}
              onChange={handleChecked}
              inputProps={{ "aria-label": "controlled" }}
              sx={{ color: colorState }}
            />
            <Typography variant="subtitle1">On</Typography>
          </Box>
        </Box>
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={handleClickOpen}
        sx={{ width: "90%" }}
      >
        Save
      </Button>
      <ConfirmDialog
        open={open}
        handleClose={handleClose}
        handleConfirm={handleConfirm}
      />
    </Paper>
  );
};

DisplayCard.propTypes = {
  Title: PropTypes.string.isRequired,
  drn: PropTypes.string.isRequired,
  controlType: PropTypes.oneOf(["mains", "heater"]).isRequired,
  Icon: PropTypes.elementType.isRequired,
};

export default DisplayCard;

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  useTheme,
} from "@mui/material";
import { tokens } from "../theme/theme";

/**
 * @module Global_Components
 */

/**
 * ConfirmDialog component to display a confirmation dialog with custom styles.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {boolean} props.open - A boolean to control the open state of the dialog.
 * @param {function} props.handleClose - A function to handle the closing of the dialog.
 * @param {function} props.handleConfirm - A function to handle the confirmation action.
 * @returns {JSX.Element} The rendered component.
 */
const ConfirmDialog = ({ open, handleClose, handleConfirm }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const dialogBackgroundColor = colors.primary[400]; // Light grey background
  const buttonTextPrimaryColor = colors.primary[100]; // White text for primary button
  const buttonPrimaryColor = colors.green[600]; // Primary green button
  const buttonSecondaryColor = colors.red[500]; // Secondary red button

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
      PaperProps={{
        style: {
          backgroundColor: dialogBackgroundColor, // Custom background color
        },
      }}
    >
      <DialogTitle id="confirm-dialog-title">Confirm Action</DialogTitle>
      <DialogContent>
        <DialogContentText id="confirm-dialog-description">
          Are you sure you want to proceed?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          style={{
            backgroundColor: buttonSecondaryColor, // Custom secondary button color
            color: buttonTextPrimaryColor, // Custom text color for buttons
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          style={{
            backgroundColor: buttonPrimaryColor, // Custom primary button color
            color: buttonTextPrimaryColor, // Custom text color for buttons
          }}
          autoFocus
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;

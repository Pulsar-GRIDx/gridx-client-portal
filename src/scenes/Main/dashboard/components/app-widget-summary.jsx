import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Avatar } from "@mui/material";
import { SvgIcon } from "@mui/material";

/**
 * A summary widget component that displays an avatar, total, and title.
 * @memberof Dashboard.Dashboard_components
 * @component
 *
 * @param {Object} props - The props object.
 * @param {string} props.title - The title to display.
 * @param {string} props.total - The total to display.
 * @param {React.ReactNode} props.icon - The icon to display inside the avatar.
 * @param {string} [props.color='primary'] - The color for the widget.
 * @param {string} props.bgcolor - The background color for the avatar.
 * @param {Object} props.sx - The sx prop for custom styling.
 * @param {Object} [props.other] - Additional props to pass to the Card component.
 *
 * @returns {JSX.Element} The rendered component.
 */
export default function AppWidgetSummary({
  title,
  total,
  icon,
  color = "primary",
  bgcolor,
  sx,
  ...other
}) {
  return (
    <Card
      component={Stack}
      spacing={3}
      direction="row"
      sx={{
        px: 3,
        py: 5,
        borderRadius: 2,
        ...sx,
      }}
      {...other}
    >
      <Avatar sx={{ backgroundColor: bgcolor }}>{icon}</Avatar>

      <Stack spacing={0.5}>
        <Typography variant="h4">{total}</Typography>

        <Typography variant="subtitle2" sx={{ color: "text.disabled" }}>
          {title}
        </Typography>
      </Stack>
    </Card>
  );
}

AppWidgetSummary.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.elementType, PropTypes.string]),
  sx: PropTypes.object,
  title: PropTypes.string,
  total: PropTypes.string,
};

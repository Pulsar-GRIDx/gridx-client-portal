import AuthRoutes from "./routes/AuthRoutes";
import MainRoutes from "./routes/MainRoutes";
import { ColorModeContext, useMode } from "./theme/theme";
import { ThemeProvider, Box } from "@mui/material";
import AuthContext from "./context/AuthContext";
import { useContext, useEffect, useState } from "react";
import Day from "./assets/Day.jpg";
import Night from "./assets/Night.jpg";

/**
 * The main application component.
 * It checks if the user is authorized and directs them to the appropriate route (dashboard or sign-in page).
 *
 * @component
 * @returns {JSX.Element} The rendered component.
 */
function App() {
  const [theme, toggleColorMode] = useMode();
  const { user } = useContext(AuthContext);
  const [authorised, setAuthorised] = useState(false);

  /**
   * useEffect hook to check if there is a token present in the session storage.
   * It runs every time the user context changes.
   */
  useEffect(() => {
    if (user) {
      const token = sessionStorage.getItem("Token");

      if (token !== null && token !== undefined && user !== null) {
        setAuthorised(true);
      }
    }
  }, [user]);

  let inactivityTimeout;

  /**
   * Sets the inactivity timeout to perform a logout action after a certain period of inactivity.
   */
  function setInactivityTimeout() {
    inactivityTimeout = setTimeout(
      () => {
        logout();
      },
      10 * 60 * 1000,
    ); // 10 minutes in milliseconds
  }

  /**
   * Resets the inactivity timeout.
   */
  function resetInactivityTimeout() {
    clearTimeout(inactivityTimeout);
    setInactivityTimeout();
  }

  /**
   * Handles user activity by resetting the inactivity timeout.
   */
  function handleUserActivity() {
    resetInactivityTimeout();
  }

  // Add event listeners for user activity
  useEffect(() => {
    document.addEventListener("mousemove", handleUserActivity);
    document.addEventListener("keypress", handleUserActivity);

    return () => {
      document.removeEventListener("mousemove", handleUserActivity);
      document.removeEventListener("keypress", handleUserActivity);
    };
  }, []);

  /**
   * Performs the logout actions.
   * It clears the authentication token, reloads the window, and cleans up event listeners.
   */
  function logout() {
    sessionStorage.removeItem("Token");
    window.location.reload();
  }

  return (
    <div>
      <ColorModeContext.Provider value={toggleColorMode}>
        <ThemeProvider theme={theme}>
          {authorised ? (
            <Box
              sx={{
                backgroundImage: `url(${theme.palette.mode === "dark" ? Night : Day})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundAttachment: "fixed",
                minHeight: "100vh",
                minWidth: "100vw",
              }}
            >
              <MainRoutes />
            </Box>
          ) : (
            <AuthRoutes />
          )}
        </ThemeProvider>
      </ColorModeContext.Provider>
    </div>
  );
}

export default App;

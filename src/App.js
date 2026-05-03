import AuthRoutes from "./routes/AuthRoutes";
import MainRoutes from "./routes/MainRoutes";
import { ColorModeContext, useMode } from "./theme/theme";
import { ThemeProvider, CssBaseline } from "@mui/material";
import AuthContext from "./context/AuthContext";
import { useContext, useEffect, useState } from "react";

function App() {
  const [theme, toggleColorMode] = useMode();
  const { user } = useContext(AuthContext);
  const [authorised, setAuthorised] = useState(false);

  useEffect(() => {
    if (user) {
      const token = sessionStorage.getItem("Token");
      if (token && user) setAuthorised(true);
    } else {
      setAuthorised(false);
    }
  }, [user]);

  useEffect(() => {
    let inactivityTimeout;
    const resetTimeout = () => {
      clearTimeout(inactivityTimeout);
      inactivityTimeout = setTimeout(() => {
        sessionStorage.removeItem("Token");
        sessionStorage.removeItem("user");
        window.location.reload();
      }, 10 * 60 * 1000);
    };
    document.addEventListener("mousemove", resetTimeout);
    document.addEventListener("keypress", resetTimeout);
    resetTimeout();
    return () => {
      clearTimeout(inactivityTimeout);
      document.removeEventListener("mousemove", resetTimeout);
      document.removeEventListener("keypress", resetTimeout);
    };
  }, []);

  return (
    <ColorModeContext.Provider value={toggleColorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {authorised ? <MainRoutes /> : <AuthRoutes />}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;

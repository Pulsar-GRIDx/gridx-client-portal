import AuthRoutes from "./routes/AuthRoutes";
import MainRoutes from "./routes/MainRoutes";
import { ColorModeContext, useMode } from "./theme/theme";
import { ThemeProvider, CssBaseline } from "@mui/material";
import AuthContext from "./context/AuthContext";
import { useContext, useEffect, useRef } from "react";

function App() {
  const [theme, toggleColorMode] = useMode();
  const { user } = useContext(AuthContext);
  const timeoutRef = useRef(null);

  const isAuthorised = !!user && !!sessionStorage.getItem("Token");

  useEffect(() => {
    const resetTimeout = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        sessionStorage.removeItem("Token");
        sessionStorage.removeItem("user");
        window.location.reload();
      }, 10 * 60 * 1000);
    };
    document.addEventListener("mousemove", resetTimeout);
    document.addEventListener("keypress", resetTimeout);
    resetTimeout();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      document.removeEventListener("mousemove", resetTimeout);
      document.removeEventListener("keypress", resetTimeout);
    };
  }, []);

  return (
    <ColorModeContext.Provider value={toggleColorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {isAuthorised ? <MainRoutes /> : <AuthRoutes />}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;

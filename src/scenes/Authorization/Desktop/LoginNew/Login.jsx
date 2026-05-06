import React, { useState, useEffect, useContext } from "react";
import {
  Box, Typography, TextField, Button, IconButton, InputAdornment,
  CircularProgress, Alert, Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../../../context/AuthContext";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DRN_REGEX = /^0260\d{12}$/;

function LoginDesktop() {
  const navigate = useNavigate();
  const { apiCallLogin, apiCallRegister, ApiErrMsg } = useContext(AuthContext);

  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [drn, setDrn] = useState("");

  useEffect(() => { setLocalError(""); }, [email, password]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) { setLocalError("Please fill in all fields"); return; }
    setLoading(true);
    setLocalError("");
    await apiCallLogin({ Email: email, Password: password, DRN: drn || undefined });
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !drn || !password) {
      setLocalError("Please fill in all required fields"); return;
    }
    if (!EMAIL_REGEX.test(email)) { setLocalError("Invalid email address"); return; }
    if (!DRN_REGEX.test(drn)) { setLocalError("DRN must start with 0260 followed by 12 digits"); return; }
    if (password.length < 6) { setLocalError("Password must be at least 6 characters"); return; }
    if (password !== confirmPwd) { setLocalError("Passwords do not match"); return; }
    setLoading(true);
    setLocalError("");
    await apiCallRegister({ FirstName: firstName, LastName: lastName, Email: email, DRN: drn, Password: password });
    setLoading(false);
  };

  const errMsg = localError || ApiErrMsg;

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2, bgcolor: "rgba(255,255,255,0.06)",
      "& fieldset": { borderColor: "rgba(255,255,255,0.12)" },
      "&:hover fieldset": { borderColor: "rgba(255,255,255,0.2)" },
      "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
    },
    "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.5)" },
    "& .MuiOutlinedInput-input": { color: "#e2e8f0" },
  };

  return (
    <Box sx={{
      minHeight: "100vh", display: "flex",
      background: "linear-gradient(135deg, #0c1222 0%, #1a2744 50%, #0f172a 100%)",
    }}>
      <Box sx={{
        display: { xs: "none", md: "flex" },
        flex: 1, alignItems: "center", justifyContent: "center",
        background: "linear-gradient(135deg, rgba(59,130,246,0.08), rgba(16,185,129,0.05))",
        position: "relative", overflow: "hidden",
      }}>
        <Box sx={{
          position: "absolute", width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)",
          top: "20%", left: "30%",
        }} />
        <Box sx={{
          position: "absolute", width: 300, height: 300, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)",
          bottom: "20%", right: "20%",
        }} />
        <Box sx={{ textAlign: "center", zIndex: 1, px: 6 }}>
          <Box sx={{ mx: "auto", mb: 3, display: "flex", justifyContent: "center" }}>
            <img src="/meter-logo.png" alt="GRIDx Meter" style={{ width: 140, height: "auto", filter: "drop-shadow(0 20px 40px rgba(59,130,246,0.3))" }} />
          </Box>
          <Typography sx={{ fontSize: 36, fontWeight: 800, color: "#f1f5f9", mb: 1.5, fontFamily: "Inter, system-ui, sans-serif" }}>
            GRIDx Portal
          </Typography>
          <Typography sx={{ fontSize: 16, color: "#94a3b8", maxWidth: 380, mx: "auto", lineHeight: 1.6 }}>
            Smart energy management at your fingertips. Monitor, control, and optimize your electricity usage.
          </Typography>
          <Box sx={{ mt: 5, display: "flex", justifyContent: "center", gap: 4 }}>
            {[
              { val: "24/7", label: "Monitoring" },
              { val: "Real-time", label: "Data" },
              { val: "Smart", label: "Control" },
            ].map((item, i) => (
              <Box key={i} sx={{ textAlign: "center" }}>
                <Typography sx={{ fontSize: 22, fontWeight: 700, color: "#60a5fa" }}>{item.val}</Typography>
                <Typography sx={{ fontSize: 12, color: "#64748b" }}>{item.label}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      <Box sx={{
        width: { xs: "100%", md: 480 }, display: "flex", alignItems: "center",
        justifyContent: "center", px: { xs: 3, sm: 5 },
      }}>
        <Box sx={{ width: "100%", maxWidth: 400 }}>
          <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center", gap: 1.5, mb: 4, justifyContent: "center" }}>
            <img src="/meter-logo-small.png" alt="GRIDx" style={{ width: 36, height: "auto" }} />
            <Typography sx={{ fontSize: 22, fontWeight: 700, color: "#f1f5f9" }}>GRIDx</Typography>
          </Box>

          <Typography sx={{ fontSize: 26, fontWeight: 700, color: "#f1f5f9", mb: 0.5 }}>
            {isSignUp ? "Create Account" : "Welcome back"}
          </Typography>
          <Typography sx={{ fontSize: 14, color: "#64748b", mb: 3 }}>
            {isSignUp ? "Register to access your meter dashboard" : "Sign in to your GRIDx account"}
          </Typography>

          {errMsg && (
            <Alert severity="error" sx={{
              mb: 2, borderRadius: 2,
              bgcolor: "rgba(239,68,68,0.1)", color: "#fca5a5",
              "& .MuiAlert-icon": { color: "#ef4444" },
              border: "1px solid rgba(239,68,68,0.2)",
            }}>
              {errMsg}
            </Alert>
          )}

          <Box component="form" onSubmit={isSignUp ? handleRegister : handleLogin} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {isSignUp && (
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  fullWidth label="First Name" size="small"
                  value={firstName} onChange={(e) => setFirstName(e.target.value)}
                  sx={inputSx} required
                />
                <TextField
                  fullWidth label="Last Name" size="small"
                  value={lastName} onChange={(e) => setLastName(e.target.value)}
                  sx={inputSx} required
                />
              </Box>
            )}
            <TextField
              fullWidth label="Email" type="email" size="small"
              value={email} onChange={(e) => setEmail(e.target.value)}
              sx={inputSx} required autoComplete="email"
            />
            {(isSignUp || drn) && (
              <TextField
                fullWidth label={isSignUp ? "Meter DRN" : "DRN (Optional)"} size="small"
                value={drn} onChange={(e) => setDrn(e.target.value)}
                placeholder="0260XXXXXXXXXXXX"
                sx={inputSx} required={isSignUp}
                inputProps={{ inputMode: "numeric" }}
              />
            )}
            {!isSignUp && !drn && (
              <Box sx={{ textAlign: "right", mt: -1 }}>
                <Link
                  component="button" type="button"
                  onClick={() => setDrn(" ")}
                  sx={{ fontSize: 12, color: "#64748b", textDecoration: "none", "&:hover": { color: "#94a3b8" } }}
                >
                  Login with DRN
                </Link>
              </Box>
            )}
            <TextField
              fullWidth label="Password" size="small"
              type={showPassword ? "text" : "password"}
              value={password} onChange={(e) => setPassword(e.target.value)}
              sx={inputSx} required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: "rgba(255,255,255,0.4)" }}>
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {isSignUp && (
              <TextField
                fullWidth label="Confirm Password" size="small"
                type="password" value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
                sx={inputSx} required
              />
            )}

            {!isSignUp && (
              <Box sx={{ textAlign: "right", mt: -0.5 }}>
                <Link
                  component="button" type="button"
                  onClick={() => navigate("/forgot-password")}
                  sx={{ fontSize: 12, color: "#60a5fa", textDecoration: "none", "&:hover": { color: "#93c5fd" } }}
                >
                  Forgot password?
                </Link>
              </Box>
            )}

            <Button
              type="submit" fullWidth variant="contained" size="large"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : (isSignUp ? <PersonAddRoundedIcon /> : <LoginRoundedIcon />)}
              sx={{
                mt: 1, borderRadius: 2, py: 1.3, fontWeight: 600, fontSize: 15,
                background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                boxShadow: "0 8px 25px rgba(59,130,246,0.3)",
                "&:hover": { background: "linear-gradient(135deg, #2563eb, #1d4ed8)", boxShadow: "0 12px 30px rgba(59,130,246,0.4)" },
              }}
            >
              {loading ? "Please wait..." : (isSignUp ? "Create Account" : "Sign In")}
            </Button>
          </Box>

          <Typography sx={{ textAlign: "center", mt: 3, fontSize: 13, color: "#64748b" }}>
            {isSignUp ? "Already have an account? " : "Don't have an account? "}
            <Link
              component="button"
              onClick={() => { setIsSignUp(!isSignUp); setLocalError(""); }}
              sx={{ color: "#60a5fa", fontWeight: 600, textDecoration: "none", "&:hover": { color: "#93c5fd" } }}
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </Link>
          </Typography>

          <Typography sx={{ textAlign: "center", mt: 4, fontSize: 11, color: "#334155" }}>
            Powered by Pulsar Namibia
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default LoginDesktop;

import React, { useState, useEffect, useContext } from "react";
import {
  Box, Typography, TextField, Button, IconButton, InputAdornment,
  CircularProgress, Alert, Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../../../context/AuthContext";
import { mtc } from "../../../../theme/theme";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";

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
  const [phone, setPhone] = useState("");

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
    if (!firstName || !lastName || !email || !drn || !phone || !password) {
      setLocalError("Please fill in all required fields"); return;
    }
    if (!EMAIL_REGEX.test(email)) { setLocalError("Invalid email address"); return; }
    if (!DRN_REGEX.test(drn)) { setLocalError("DRN must start with 0260 followed by 12 digits"); return; }
    if (phone.replace(/[\s\-()]/g, "").length < 8) { setLocalError("Please enter a valid phone number"); return; }
    if (password.length < 6) { setLocalError("Password must be at least 6 characters"); return; }
    if (password !== confirmPwd) { setLocalError("Passwords do not match"); return; }
    setLoading(true);
    setLocalError("");
    await apiCallRegister({ FirstName: firstName, LastName: lastName, Email: email, DRN: drn, Phone: phone, Password: password });
    setLoading(false);
  };

  const errMsg = localError || ApiErrMsg;

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2, bgcolor: "#fff",
      "& fieldset": { borderColor: "#e2e8f0" },
      "&:hover fieldset": { borderColor: "#cbd5e1" },
      "&.Mui-focused fieldset": { borderColor: mtc.blue[500], borderWidth: 1.5 },
    },
    "& .MuiInputLabel-root": { color: "#64748b" },
    "& .MuiInputLabel-root.Mui-focused": { color: mtc.blue[600] },
    "& .MuiOutlinedInput-input": { color: "#0f172a" },
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: { xs: "column", md: "row" }, bgcolor: "#fff" }}>

      {/* Angled brand panel — signature shape instead of a plain rectangle,
          bottom edge on mobile / right edge on desktop cuts on a diagonal. */}
      <Box sx={{
        position: "relative", overflow: "hidden", flexShrink: 0,
        width: { xs: "100%", md: "38%" },
        height: { xs: 220, sm: 260, md: "auto" },
        background: `linear-gradient(160deg, ${mtc.blue[600]} 0%, ${mtc.blue[800]} 100%)`,
        clipPath: {
          xs: "polygon(0 0, 100% 0, 100% 82%, 0 100%)",
          md: "polygon(0 0, 100% 0, 82% 100%, 0 100%)",
        },
      }}>
        {/* Faint concentric signal rings behind the mark — quiet nod to "smart meter" without needing an illustration */}
        <Box sx={{
          position: "absolute", top: "38%", left: { xs: "50%", md: "38%" }, transform: "translate(-50%, -50%)",
          width: 260, height: 260, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.14)",
        }} />
        <Box sx={{
          position: "absolute", top: "38%", left: { xs: "50%", md: "38%" }, transform: "translate(-50%, -50%)",
          width: 180, height: 180, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.16)",
        }} />
        <Box sx={{
          position: "absolute", top: "38%", left: { xs: "50%", md: "38%" }, transform: "translate(-50%, -50%)",
          width: 100, height: 100, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.2)",
          animation: "loginPulse 2.6s ease-out infinite",
          "@keyframes loginPulse": {
            "0%": { transform: "translate(-50%, -50%) scale(1)", opacity: 0.9 },
            "100%": { transform: "translate(-50%, -50%) scale(2.1)", opacity: 0 },
          },
        }} />

        <Box sx={{
          position: "relative", zIndex: 1, height: "100%",
          display: "flex", flexDirection: "column", justifyContent: "center",
          px: { xs: 4, md: 5 }, py: { xs: 3, md: 0 },
          alignItems: { xs: "center", md: "flex-start" }, textAlign: { xs: "center", md: "left" },
        }}>
          <Box sx={{
            width: 52, height: 52, borderRadius: "4px", mb: 2.5,
            display: "flex", alignItems: "center", justifyContent: "center",
            bgcolor: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.3)",
          }}>
            <BoltRoundedIcon sx={{ color: "#fff", fontSize: 28 }} />
          </Box>
          <Typography sx={{ fontSize: { xs: 24, md: 28 }, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em", mb: 1 }}>
            GRIDx
          </Typography>
          <Typography sx={{
            fontSize: 13.5, color: "rgba(255,255,255,0.8)", lineHeight: 1.6, maxWidth: 260,
            display: { xs: "none", sm: "block" },
          }}>
            Smart energy management for your prepaid meter — monitor, recharge, and stay in control.
          </Typography>
        </Box>
      </Box>

      {/* Form side — plain white, no floating card, generous whitespace.
          Top-aligned on mobile (the panel above already anchors the top
          visually, so true vertical centering pushes the form oddly low
          and leaves a dead gap at the bottom); centered once there's no
          stacked panel competing for attention on desktop. */}
      <Box sx={{
        flex: 1, display: "flex", alignItems: { xs: "flex-start", md: "center" }, justifyContent: "center",
        px: { xs: 3, sm: 6 }, py: { xs: 4, md: 6 },
      }}>
        <Box sx={{ width: "100%", maxWidth: 380 }}>
          <Typography sx={{ fontSize: 26, fontWeight: 800, color: "#0a1740", mb: 0.5, letterSpacing: "-0.01em" }}>
            {isSignUp ? "Create your account" : "Welcome back"}
          </Typography>
          <Typography sx={{ fontSize: 13.5, color: "#64748b", mb: 3.5 }}>
            {isSignUp ? "Register to access your meter dashboard" : "Sign in to your GRIDx account"}
          </Typography>

          {errMsg && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
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
            {isSignUp && (
              <TextField
                fullWidth label="Phone Number" size="small"
                value={phone} onChange={(e) => setPhone(e.target.value)}
                placeholder="+264 XX XXX XXXX"
                sx={inputSx} required
                inputProps={{ inputMode: "tel" }}
                helperText="Must be an authorized number on the meter"
              />
            )}
            {!isSignUp && !drn && (
              <Box sx={{ textAlign: "right", mt: -1 }}>
                <Link
                  component="button" type="button"
                  onClick={() => setDrn(" ")}
                  sx={{ fontSize: 12, color: "#94a3b8", textDecoration: "none", "&:hover": { color: "#64748b" } }}
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
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: "#94a3b8" }}>
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
                  sx={{ fontSize: 12, color: mtc.blue[600], fontWeight: 600, textDecoration: "none", "&:hover": { color: mtc.blue[700] } }}
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
                mt: 1, borderRadius: 2, py: 1.3, fontWeight: 700, fontSize: 15,
                background: mtc.gradient,
                boxShadow: `0 10px 24px -6px ${mtc.glow}`,
                "&:hover": { background: mtc.gradientHover, boxShadow: `0 14px 28px -6px ${mtc.glow}` },
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
              sx={{ color: mtc.blue[600], fontWeight: 700, textDecoration: "none", "&:hover": { color: mtc.blue[700] } }}
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </Link>
          </Typography>

          <Typography sx={{ textAlign: "center", mt: 4, fontSize: 11, color: "#cbd5e1" }}>
            Powered by Pulsar Namibia
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default LoginDesktop;

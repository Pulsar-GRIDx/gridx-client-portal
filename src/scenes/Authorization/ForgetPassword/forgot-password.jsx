import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Typography, TextField, Button, CssBaseline, Alert,
  IconButton, InputAdornment, CircularProgress,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { customerAuthAPI } from "../../../services/api";

const STEPS = { EMAIL: 0, VERIFY: 1, RESET: 2, DONE: 3 };

function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(STEPS.EMAIL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError("");
    const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.match(emailFormat)) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      await customerAuthAPI.forgotPassword(email);
      setSuccess("Verification code sent to " + email);
      setStep(STEPS.VERIFY);
    } catch (err) {
      if (err.message.includes("not found")) {
        setError("Email not found. Please register first.");
      } else {
        setError(err.message || "Failed to send verification code.");
      }
    }
    setLoading(false);
  };

  const handleVerifyPin = async (e) => {
    e.preventDefault();
    setError("");
    if (!pin || pin.length < 4) {
      setError("Please enter the verification code from your email.");
      return;
    }
    setLoading(true);
    try {
      await customerAuthAPI.verifyPin(email, pin);
      setSuccess("Code verified. Set your new password.");
      setStep(STEPS.RESET);
    } catch (err) {
      setError(err.message || "Invalid or expired verification code.");
    }
    setLoading(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    if (!newPassword || newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await customerAuthAPI.resetPassword(email, pin, newPassword, newPassword);
      setSuccess("Password reset successful!");
      setStep(STEPS.DONE);
    } catch (err) {
      setError(err.message || "Failed to reset password. Try again.");
    }
    setLoading(false);
  };

  const stepTitles = {
    [STEPS.EMAIL]: "Reset Password",
    [STEPS.VERIFY]: "Enter Verification Code",
    [STEPS.RESET]: "Set New Password",
    [STEPS.DONE]: "Password Reset",
  };

  const stepDescriptions = {
    [STEPS.EMAIL]: "Enter your email address to receive a verification code",
    [STEPS.VERIFY]: "Check your email and enter the 6-digit code below",
    [STEPS.RESET]: "Choose a strong password for your account",
    [STEPS.DONE]: "Your password has been reset successfully",
  };

  return (
    <Box sx={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg, #0c1222 0%, #1a2744 50%, #0f172a 100%)",
      px: 3,
    }}>
      <CssBaseline />
      <Box sx={{ width: "100%", maxWidth: 420 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 4, justifyContent: "center" }}>
          <img src="/meter-logo-small.png" alt="GRIDx" style={{ width: 36, height: "auto" }} />
          <Typography sx={{ fontSize: 22, fontWeight: 700, color: "#f1f5f9" }}>GRIDx</Typography>
        </Box>

        <Typography sx={{ fontSize: 26, fontWeight: 700, color: "#f1f5f9", mb: 0.5, textAlign: "center" }}>
          {stepTitles[step]}
        </Typography>
        <Typography sx={{ fontSize: 14, color: "#64748b", mb: 3, textAlign: "center" }}>
          {stepDescriptions[step]}
        </Typography>

        {error && (
          <Alert severity="error" onClose={() => setError("")} sx={{
            mb: 2, borderRadius: 2,
            bgcolor: "rgba(239,68,68,0.1)", color: "#fca5a5",
            "& .MuiAlert-icon": { color: "#ef4444" },
            border: "1px solid rgba(239,68,68,0.2)",
          }}>
            {error}
          </Alert>
        )}

        {success && step !== STEPS.EMAIL && (
          <Alert severity="success" sx={{
            mb: 2, borderRadius: 2,
            bgcolor: "rgba(34,197,94,0.1)", color: "#86efac",
            "& .MuiAlert-icon": { color: "#22c55e" },
            border: "1px solid rgba(34,197,94,0.2)",
          }}>
            {success}
          </Alert>
        )}

        {step === STEPS.EMAIL && (
          <Box component="form" onSubmit={handleSendCode} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              fullWidth label="Email" type="email" size="small"
              value={email} onChange={(e) => setEmail(e.target.value)}
              sx={inputSx} required autoComplete="email" autoFocus
            />
            <Button
              type="submit" fullWidth variant="contained" size="large"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
              sx={{
                mt: 1, borderRadius: 2, py: 1.3, fontWeight: 600,
                background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                boxShadow: "0 8px 25px rgba(59,130,246,0.3)",
                "&:hover": { background: "linear-gradient(135deg, #2563eb, #1d4ed8)" },
              }}
            >
              {loading ? "Sending..." : "Send Verification Code"}
            </Button>
          </Box>
        )}

        {step === STEPS.VERIFY && (
          <Box component="form" onSubmit={handleVerifyPin} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              fullWidth label="6-Digit Verification Code" size="small"
              value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
              sx={inputSx} required autoFocus
              inputProps={{ inputMode: "numeric", maxLength: 6, style: { letterSpacing: 8, textAlign: "center", fontSize: 20 } }}
              placeholder="000000"
            />
            <Button
              type="submit" fullWidth variant="contained" size="large"
              disabled={loading || pin.length < 6}
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
              sx={{
                mt: 1, borderRadius: 2, py: 1.3, fontWeight: 600,
                background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                boxShadow: "0 8px 25px rgba(59,130,246,0.3)",
                "&:hover": { background: "linear-gradient(135deg, #2563eb, #1d4ed8)" },
              }}
            >
              {loading ? "Verifying..." : "Verify Code"}
            </Button>
            <Button
              variant="text" size="small"
              onClick={() => { setStep(STEPS.EMAIL); setError(""); setSuccess(""); }}
              sx={{ color: "#64748b", "&:hover": { color: "#94a3b8" } }}
            >
              Didn't receive code? Send again
            </Button>
          </Box>
        )}

        {step === STEPS.RESET && (
          <Box component="form" onSubmit={handleResetPassword} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              fullWidth label="New Password" size="small"
              type={showPassword ? "text" : "password"}
              value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
              sx={inputSx} required autoFocus
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
            <TextField
              fullWidth label="Confirm Password" size="small"
              type="password"
              value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
              sx={inputSx} required
            />
            <Typography sx={{ fontSize: 11, color: "#475569" }}>
              Password must be at least 6 characters
            </Typography>
            <Button
              type="submit" fullWidth variant="contained" size="large"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
              sx={{
                mt: 1, borderRadius: 2, py: 1.3, fontWeight: 600,
                background: "linear-gradient(135deg, #22c55e, #16a34a)",
                boxShadow: "0 8px 25px rgba(34,197,94,0.3)",
                "&:hover": { background: "linear-gradient(135deg, #16a34a, #15803d)" },
              }}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </Box>
        )}

        {step === STEPS.DONE && (
          <Box sx={{ textAlign: "center" }}>
            <Button
              fullWidth variant="contained" size="large"
              onClick={() => navigate("/")}
              sx={{
                mt: 2, borderRadius: 2, py: 1.3, fontWeight: 600,
                background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                boxShadow: "0 8px 25px rgba(59,130,246,0.3)",
                "&:hover": { background: "linear-gradient(135deg, #2563eb, #1d4ed8)" },
              }}
            >
              Go to Login
            </Button>
          </Box>
        )}

        {step !== STEPS.DONE && (
          <Button
            startIcon={<ArrowBackRoundedIcon />}
            onClick={() => navigate("/")}
            sx={{ mt: 3, color: "#64748b", "&:hover": { color: "#94a3b8" }, display: "flex", mx: "auto" }}
          >
            Back to Login
          </Button>
        )}
      </Box>
    </Box>
  );
}

export default ForgotPassword;

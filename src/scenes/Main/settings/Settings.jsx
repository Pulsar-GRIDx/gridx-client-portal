import React, { useState, useEffect, useContext } from "react";
import {
  Box, Typography, Paper, Grid, TextField, Button, Tabs, Tab,
  CircularProgress, Alert,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AuthContext from "../../../context/AuthContext";
import { customerAuthAPI, meterDataAPI } from "../../../services/api";
import LockResetRoundedIcon from "@mui/icons-material/LockResetRounded";
import ElectricMeterRoundedIcon from "@mui/icons-material/ElectricMeterRounded";

function Settings() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { userInfo } = useContext(AuthContext);
  const drn = userInfo?.DRN || JSON.parse(sessionStorage.getItem("user") || "{}")?.DRN || "";

  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!drn) return;
    meterDataAPI.getProfileByDRN(drn).then(d => setProfile(d?.data || d)).catch(() => {});
  }, [drn]);

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }
    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters" });
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const email = userInfo?.Email || userInfo?.email;
      await customerAuthAPI.forgotPassword(email);
      setMessage({ type: "success", text: "Password reset email sent. Check your inbox for the verification code." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to change password" });
    }
    setLoading(false);
  };

  const cardSx = {
    p: 3, borderRadius: 3,
    bgcolor: isDark ? "rgba(30,41,59,0.6)" : "#fff",
    border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#e2e8f0"}`,
  };

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      bgcolor: isDark ? "rgba(255,255,255,0.03)" : "#f8fafc",
      "& fieldset": { borderColor: isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0" },
    },
    "& .MuiInputLabel-root": { color: isDark ? "#64748b" : "#94a3b8" },
    "& .MuiOutlinedInput-input": { color: isDark ? "#e2e8f0" : "#1e293b" },
  };

  const profileFields = profile ? [
    { label: "Name", val: `${profile.Name || ""} ${profile.Surname || ""}`.trim() || "N/A" },
    { label: "DRN", val: profile.DRN || drn },
    { label: "City", val: profile.City || "N/A" },
    { label: "Region", val: profile.Region || "N/A" },
    { label: "Street", val: profile.StreetName || "N/A" },
    { label: "Tariff Type", val: profile.tariff_type || "N/A" },
    { label: "SIM Number", val: profile.SIMNumber || "N/A" },
    { label: "Transformer", val: profile.TransformerDRN || "N/A" },
  ] : [];

  return (
    <Box sx={{ maxHeight: "calc(100vh - 80px)", overflowY: "auto", pb: 4, px: { xs: 0, sm: 1 } }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h2" sx={{ color: isDark ? "#f1f5f9" : "#0f172a" }}>Settings</Typography>
        <Typography sx={{ color: isDark ? "#64748b" : "#94a3b8", fontSize: 13, mt: 0.5 }}>
          Account settings and meter information
        </Typography>
      </Box>

      {message && (
        <Alert severity={message.type} onClose={() => setMessage(null)} sx={{ mb: 2, borderRadius: 2 }}>
          {message.text}
        </Alert>
      )}

      <Tabs
        value={tab} onChange={(_, v) => setTab(v)}
        sx={{
          mb: 3, minHeight: 40,
          "& .MuiTab-root": { textTransform: "none", fontWeight: 500, fontSize: 13, minHeight: 40, py: 1 },
          "& .MuiTabs-indicator": { borderRadius: 2, height: 3 },
        }}
      >
        <Tab label="Change Password" icon={<LockResetRoundedIcon sx={{ fontSize: 18 }} />} iconPosition="start" />
        <Tab label="Meter Info" icon={<ElectricMeterRoundedIcon sx={{ fontSize: 18 }} />} iconPosition="start" />
      </Tabs>

      {tab === 0 && (
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={cardSx}>
              <Typography sx={{ fontSize: 16, fontWeight: 600, mb: 0.5, color: isDark ? "#e2e8f0" : "#1e293b" }}>
                Change Password
              </Typography>
              <Typography sx={{ fontSize: 12, color: isDark ? "#64748b" : "#94a3b8", mb: 3 }}>
                This will send a password reset code to your email
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  fullWidth label="Current Password" type="password"
                  value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
                  sx={inputSx}
                />
                <TextField
                  fullWidth label="New Password" type="password"
                  value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                  sx={inputSx}
                />
                <TextField
                  fullWidth label="Confirm New Password" type="password"
                  value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  sx={inputSx}
                />
                <Button
                  variant="contained" onClick={handleChangePassword}
                  disabled={loading || !newPassword || !confirmPassword}
                  startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <LockResetRoundedIcon />}
                  sx={{
                    borderRadius: 2, py: 1.2, fontWeight: 600,
                    background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                    "&:hover": { background: "linear-gradient(135deg, #2563eb, #1d4ed8)" },
                  }}
                >
                  {loading ? "Processing..." : "Change Password"}
                </Button>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{
              ...cardSx,
              background: isDark ? "linear-gradient(135deg, rgba(59,130,246,0.08), rgba(16,185,129,0.08))" : "linear-gradient(135deg, rgba(59,130,246,0.04), rgba(16,185,129,0.04))",
            }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 2, color: isDark ? "#e2e8f0" : "#1e293b" }}>
                Account Information
              </Typography>
              {[
                { label: "Email", val: userInfo?.Email || userInfo?.email || "N/A" },
                { label: "Name", val: `${userInfo?.FirstName || ""} ${userInfo?.LastName || ""}`.trim() || "N/A" },
                { label: "DRN", val: drn || "N/A" },
                { label: "Phone", val: userInfo?.Phone || userInfo?.phone || "N/A" },
              ].map((item, i) => (
                <Box key={i} sx={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  py: 1.2, borderBottom: i < 3 ? `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "#f1f5f9"}` : "none",
                }}>
                  <Typography sx={{ fontSize: 12, color: isDark ? "#94a3b8" : "#64748b" }}>{item.label}</Typography>
                  <Typography sx={{ fontSize: 12, fontWeight: 600, color: isDark ? "#e2e8f0" : "#1e293b" }}>{item.val}</Typography>
                </Box>
              ))}
            </Paper>
          </Grid>
        </Grid>
      )}

      {tab === 1 && (
        <Paper elevation={0} sx={cardSx}>
          <Typography sx={{ fontSize: 16, fontWeight: 600, mb: 2, color: isDark ? "#e2e8f0" : "#1e293b" }}>
            Meter Profile
          </Typography>
          {profileFields.length > 0 ? (
            <Grid container spacing={2}>
              {profileFields.map((field, i) => (
                <Grid item xs={12} sm={6} key={i}>
                  <Box sx={{
                    p: 2, borderRadius: 2,
                    bgcolor: isDark ? "rgba(255,255,255,0.03)" : "#f8fafc",
                    border: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "#f1f5f9"}`,
                  }}>
                    <Typography sx={{ fontSize: 11, color: isDark ? "#64748b" : "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5, mb: 0.5 }}>
                      {field.label}
                    </Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 600, color: isDark ? "#e2e8f0" : "#1e293b" }}>
                      {field.val}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography sx={{ color: isDark ? "#475569" : "#94a3b8", fontSize: 13 }}>Loading meter profile...</Typography>
          )}
        </Paper>
      )}

    </Box>
  );
}

export default Settings;

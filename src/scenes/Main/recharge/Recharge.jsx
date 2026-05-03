import React, { useState, useEffect, useContext } from "react";
import {
  Box, Typography, Paper, Grid, TextField, Button, Tabs, Tab, Chip,
  CircularProgress, Alert, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AuthContext from "../../../context/AuthContext";
import { meterControlAPI, meterDataAPI, mqttAPI, vendingAPI } from "../../../services/api";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import SwapHorizRoundedIcon from "@mui/icons-material/SwapHorizRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";

function Recharge() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { userInfo } = useContext(AuthContext);
  const drn = userInfo?.DRN || JSON.parse(sessionStorage.getItem("user") || "{}")?.DRN || "";

  const [tab, setTab] = useState(0);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [tokenHistory, setTokenHistory] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [transferDRN, setTransferDRN] = useState("");
  const [transferAmount, setTransferAmount] = useState("");

  useEffect(() => {
    if (!drn) return;
    meterDataAPI.getStsTokens(drn).then(d => {
      const arr = Array.isArray(d) ? d : d?.data || [];
      setTokenHistory(arr);
    }).catch(() => {});
    vendingAPI.getTransactions({ drn }).then(d => {
      const arr = Array.isArray(d) ? d : d?.data || [];
      setTransactions(arr);
    }).catch(() => {});
  }, [drn]);

  const sendToken = async () => {
    if (!token.trim()) return;
    setLoading(true);
    setMessage(null);
    try {
      const cleaned = token.replace(/[\s-]/g, "");
      await meterControlAPI.sendToken(drn, cleaned);
      setMessage({ type: "success", text: "Token sent successfully! It will be applied to your meter shortly." });
      setToken("");
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to send token" });
    }
    setLoading(false);
  };

  const handleTransfer = async () => {
    if (!transferDRN.trim() || !transferAmount.trim()) return;
    setLoading(true);
    setMessage(null);
    try {
      await mqttAPI.creditTransfer(drn, { target_drn: transferDRN, amount: parseFloat(transferAmount) });
      setMessage({ type: "success", text: `Credit transfer of ${transferAmount} kWh initiated to ${transferDRN}` });
      setTransferDRN("");
      setTransferAmount("");
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Transfer failed" });
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

  return (
    <Box sx={{ maxHeight: "calc(100vh - 80px)", overflowY: "auto", pb: 4, px: { xs: 0, sm: 1 } }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h2" sx={{ color: isDark ? "#f1f5f9" : "#0f172a" }}>Recharge</Typography>
        <Typography sx={{ color: isDark ? "#64748b" : "#94a3b8", fontSize: 13, mt: 0.5 }}>
          Send tokens, transfer credit, and view history
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
        <Tab label="Send Token" icon={<SendRoundedIcon sx={{ fontSize: 18 }} />} iconPosition="start" />
        <Tab label="Credit Transfer" icon={<SwapHorizRoundedIcon sx={{ fontSize: 18 }} />} iconPosition="start" />
        <Tab label="Token History" icon={<HistoryRoundedIcon sx={{ fontSize: 18 }} />} iconPosition="start" />
        <Tab label="Transactions" icon={<ReceiptLongRoundedIcon sx={{ fontSize: 18 }} />} iconPosition="start" />
      </Tabs>

      {tab === 0 && (
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={cardSx}>
              <Typography sx={{ fontSize: 16, fontWeight: 600, mb: 0.5, color: isDark ? "#e2e8f0" : "#1e293b" }}>
                Enter STS Token
              </Typography>
              <Typography sx={{ fontSize: 12, color: isDark ? "#64748b" : "#94a3b8", mb: 3 }}>
                Enter your 20-digit prepaid electricity token
              </Typography>
              <TextField
                fullWidth label="STS Token" placeholder="0000 0000 0000 0000 0000"
                value={token} onChange={(e) => setToken(e.target.value)}
                sx={{ ...inputSx, mb: 2 }}
                inputProps={{ maxLength: 24, style: { fontFamily: "monospace", fontSize: 16, letterSpacing: 2 } }}
              />
              <Button
                fullWidth variant="contained" size="large"
                onClick={sendToken} disabled={loading || !token.trim()}
                startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <SendRoundedIcon />}
                sx={{
                  borderRadius: 2, py: 1.3, fontWeight: 600,
                  background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                  "&:hover": { background: "linear-gradient(135deg, #2563eb, #1d4ed8)" },
                }}
              >
                {loading ? "Sending..." : "Send Token"}
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ ...cardSx, background: isDark ? "linear-gradient(135deg, rgba(59,130,246,0.1), rgba(16,185,129,0.1))" : "linear-gradient(135deg, rgba(59,130,246,0.05), rgba(16,185,129,0.05))" }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 2, color: isDark ? "#e2e8f0" : "#1e293b" }}>
                How to Recharge
              </Typography>
              {["Purchase a prepaid electricity token from your vendor", "Enter the 20-digit token number above", "Click Send Token to apply credits to your meter", "Your meter balance will update within 1-2 minutes"].map((step, i) => (
                <Box key={i} sx={{ display: "flex", gap: 1.5, mb: 1.5 }}>
                  <Box sx={{
                    width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                    bgcolor: isDark ? "rgba(59,130,246,0.2)" : "rgba(37,99,235,0.1)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Typography sx={{ fontSize: 11, fontWeight: 700, color: isDark ? "#60a5fa" : "#2563eb" }}>{i + 1}</Typography>
                  </Box>
                  <Typography sx={{ fontSize: 12, color: isDark ? "#94a3b8" : "#64748b", lineHeight: 1.6 }}>{step}</Typography>
                </Box>
              ))}
            </Paper>
          </Grid>
        </Grid>
      )}

      {tab === 1 && (
        <Paper elevation={0} sx={cardSx}>
          <Typography sx={{ fontSize: 16, fontWeight: 600, mb: 0.5, color: isDark ? "#e2e8f0" : "#1e293b" }}>
            Transfer Credit
          </Typography>
          <Typography sx={{ fontSize: 12, color: isDark ? "#64748b" : "#94a3b8", mb: 3 }}>
            Send electricity credit to another meter
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth label="Destination DRN" placeholder="0260XXXXXXXXXXXX"
                value={transferDRN} onChange={(e) => setTransferDRN(e.target.value)}
                sx={inputSx}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth label="Amount (kWh)" placeholder="10"
                type="number" value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                sx={inputSx}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained" onClick={handleTransfer}
                disabled={loading || !transferDRN.trim() || !transferAmount.trim()}
                startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <SwapHorizRoundedIcon />}
                sx={{
                  borderRadius: 2, py: 1.2, px: 4, fontWeight: 600,
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  "&:hover": { background: "linear-gradient(135deg, #059669, #047857)" },
                }}
              >
                {loading ? "Transferring..." : "Transfer Credit"}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}

      {tab === 2 && (
        <Paper elevation={0} sx={cardSx}>
          <Typography sx={{ fontSize: 16, fontWeight: 600, mb: 2, color: isDark ? "#e2e8f0" : "#1e293b" }}>
            Token History
          </Typography>
          {tokenHistory.length > 0 ? (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {["Token", "Amount", "Date", "Status"].map(h => (
                      <TableCell key={h} sx={{ fontWeight: 600, fontSize: 12, color: isDark ? "#94a3b8" : "#64748b", borderColor: isDark ? "rgba(255,255,255,0.06)" : "#f1f5f9" }}>
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tokenHistory.slice(0, 20).map((t, i) => (
                    <TableRow key={i}>
                      <TableCell sx={{ fontSize: 12, fontFamily: "monospace", color: isDark ? "#e2e8f0" : "#1e293b", borderColor: isDark ? "rgba(255,255,255,0.04)" : "#f8fafc" }}>
                        {t.token || t.Token || t.token_ID || "---"}
                      </TableCell>
                      <TableCell sx={{ fontSize: 12, color: isDark ? "#e2e8f0" : "#1e293b", borderColor: isDark ? "rgba(255,255,255,0.04)" : "#f8fafc" }}>
                        {t.amount || t.Amount || t.units || "---"}
                      </TableCell>
                      <TableCell sx={{ fontSize: 12, color: isDark ? "#94a3b8" : "#64748b", borderColor: isDark ? "rgba(255,255,255,0.04)" : "#f8fafc" }}>
                        {t.date_time ? new Date(t.date_time).toLocaleString() : t.date || "---"}
                      </TableCell>
                      <TableCell sx={{ borderColor: isDark ? "rgba(255,255,255,0.04)" : "#f8fafc" }}>
                        <Chip label={t.status || "Applied"} size="small" sx={{ fontSize: 10, fontWeight: 600, bgcolor: "rgba(34,197,94,0.1)", color: "#22c55e" }} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography sx={{ color: isDark ? "#475569" : "#94a3b8", fontSize: 13, textAlign: "center", py: 4 }}>
              No token history available
            </Typography>
          )}
        </Paper>
      )}

      {tab === 3 && (
        <Paper elevation={0} sx={cardSx}>
          <Typography sx={{ fontSize: 16, fontWeight: 600, mb: 2, color: isDark ? "#e2e8f0" : "#1e293b" }}>
            Transactions
          </Typography>
          {transactions.length > 0 ? (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {["Reference", "Amount", "Type", "Date"].map(h => (
                      <TableCell key={h} sx={{ fontWeight: 600, fontSize: 12, color: isDark ? "#94a3b8" : "#64748b", borderColor: isDark ? "rgba(255,255,255,0.06)" : "#f1f5f9" }}>
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.slice(0, 20).map((t, i) => (
                    <TableRow key={i}>
                      <TableCell sx={{ fontSize: 12, color: isDark ? "#e2e8f0" : "#1e293b", borderColor: isDark ? "rgba(255,255,255,0.04)" : "#f8fafc" }}>
                        {t.reference || t.id || "---"}
                      </TableCell>
                      <TableCell sx={{ fontSize: 12, fontWeight: 600, color: isDark ? "#e2e8f0" : "#1e293b", borderColor: isDark ? "rgba(255,255,255,0.04)" : "#f8fafc" }}>
                        {t.amount || "---"}
                      </TableCell>
                      <TableCell sx={{ borderColor: isDark ? "rgba(255,255,255,0.04)" : "#f8fafc" }}>
                        <Chip label={t.type || "Purchase"} size="small" sx={{ fontSize: 10, fontWeight: 600, bgcolor: isDark ? "rgba(59,130,246,0.1)" : "rgba(37,99,235,0.08)", color: isDark ? "#60a5fa" : "#2563eb" }} />
                      </TableCell>
                      <TableCell sx={{ fontSize: 12, color: isDark ? "#94a3b8" : "#64748b", borderColor: isDark ? "rgba(255,255,255,0.04)" : "#f8fafc" }}>
                        {t.date_time ? new Date(t.date_time).toLocaleString() : t.date || "---"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography sx={{ color: isDark ? "#475569" : "#94a3b8", fontSize: 13, textAlign: "center", py: 4 }}>
              No transactions available
            </Typography>
          )}
        </Paper>
      )}
    </Box>
  );
}

export default Recharge;

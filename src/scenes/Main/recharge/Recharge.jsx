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
import CalculateRoundedIcon from "@mui/icons-material/CalculateRounded";

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
  const [tariffInfo, setTariffInfo] = useState(null);
  const [costAmount, setCostAmount] = useState("");

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
    vendingAPI.getTariffInfo(drn).then(d => {
      setTariffInfo(d?.data || d);
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

  const computeCostBreakdown = (amount) => {
    if (!amount || amount <= 0 || !tariffInfo) return null;
    const cfg = tariffInfo.config || {};
    const vatRate = parseFloat(cfg.vatRate || 15);
    const fixedCharge = parseFloat(cfg.fixedCharge || 0);
    const relLevy = parseFloat(cfg.relLevy || 0);
    const ecbLevy = parseFloat(cfg.ecbLevy || 0);
    const nefLevy = parseFloat(cfg.nefLevy || 0);

    const vatAmount = amount - amount / (1 + vatRate / 100);
    const afterVat = amount - vatAmount;
    const afterFixed = afterVat - fixedCharge;
    const afterLevy = afterFixed - relLevy - ecbLevy - nefLevy;
    const netEnergy = Math.max(afterLevy, 0);

    const rate = parseFloat(tariffInfo.currentRate || 0);
    const totalKwh = rate > 0 ? netEnergy / rate : 0;

    const costRows = [];
    if (rate > 0) {
      costRows.push({ label: tariffInfo.tariffGroup?.name || "Standard", rate, kwh: totalKwh, cost: netEnergy });
    }

    return {
      amountTendered: amount,
      vatAmount,
      fixedCharge,
      relLevy,
      ecbLevy,
      nefLevy,
      netEnergy,
      totalKwh,
      rate,
      tariffName: tariffInfo.tariffGroup?.name || "N/A",
      tariffType: tariffInfo.tariffGroup?.type || "Flat",
      currentPeriod: tariffInfo.currentPeriod || "standard",
      costRows,
    };
  };

  const costBreakdown = computeCostBreakdown(parseFloat(costAmount) || 0);

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
        <Tab label="Energy Cost" icon={<CalculateRoundedIcon sx={{ fontSize: 18 }} />} iconPosition="start" />
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
      {tab === 4 && (
        <Paper elevation={0} sx={cardSx}>
          <Typography sx={{ fontSize: 16, fontWeight: 600, mb: 0.5, color: isDark ? "#e2e8f0" : "#1e293b" }}>
            Energy Cost Calculator
          </Typography>
          <Typography sx={{ fontSize: 12, color: isDark ? "#64748b" : "#94a3b8", mb: 3 }}>
            See how much energy you get for a given amount based on your tariff
          </Typography>

          <TextField
            label="Amount (N$)" type="number" placeholder="100"
            value={costAmount} onChange={(e) => setCostAmount(e.target.value)}
            sx={{ ...inputSx, mb: 3, width: { xs: "100%", sm: 300 } }}
          />

          {costBreakdown && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 1.5, color: isDark ? "#e2e8f0" : "#1e293b" }}>
                  Deductions
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableBody>
                      {[
                        { label: "Amount Tendered", val: `N$ ${costBreakdown.amountTendered.toFixed(2)}`, color: isDark ? "#f1f5f9" : "#0f172a" },
                        { label: `VAT (${tariffInfo?.config?.vatRate || 15}%)`, val: `- N$ ${costBreakdown.vatAmount.toFixed(2)}`, color: "#ef4444" },
                        { label: "Fixed Charge", val: `- N$ ${costBreakdown.fixedCharge.toFixed(2)}`, color: "#ef4444" },
                        { label: "REL Levy", val: `- N$ ${costBreakdown.relLevy.toFixed(2)}`, color: "#ef4444" },
                        ...(costBreakdown.ecbLevy > 0 ? [{ label: "ECB Levy", val: `- N$ ${costBreakdown.ecbLevy.toFixed(2)}`, color: "#ef4444" }] : []),
                        ...(costBreakdown.nefLevy > 0 ? [{ label: "NEF Levy", val: `- N$ ${costBreakdown.nefLevy.toFixed(2)}`, color: "#ef4444" }] : []),
                        { label: "Net Energy Amount", val: `N$ ${costBreakdown.netEnergy.toFixed(2)}`, color: "#22c55e" },
                      ].map((row, i) => (
                        <TableRow key={i}>
                          <TableCell sx={{ fontSize: 12, color: isDark ? "#94a3b8" : "#64748b", borderColor: isDark ? "rgba(255,255,255,0.04)" : "#f8fafc", pl: 0 }}>
                            {row.label}
                          </TableCell>
                          <TableCell align="right" sx={{ fontSize: 12, fontWeight: 600, color: row.color, borderColor: isDark ? "rgba(255,255,255,0.04)" : "#f8fafc", pr: 0 }}>
                            {row.val}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 1.5, color: isDark ? "#e2e8f0" : "#1e293b" }}>
                  Energy Cost Breakdown
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        {["Tariff", "Rate (N$/kWh)", "kWh", "Cost (N$)"].map(h => (
                          <TableCell key={h} align={h === "Tariff" ? "left" : "right"} sx={{
                            fontWeight: 600, fontSize: 11, color: isDark ? "#60a5fa" : "#2563eb",
                            borderColor: isDark ? "rgba(59,130,246,0.2)" : "rgba(37,99,235,0.15)",
                            ...(h === "Tariff" ? { pl: 0 } : {}),
                            ...(h === "Cost (N$)" ? { pr: 0 } : {}),
                          }}>
                            {h}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {costBreakdown.costRows.map((row, i) => (
                        <TableRow key={i}>
                          <TableCell sx={{ fontSize: 12, color: isDark ? "#e2e8f0" : "#1e293b", borderColor: isDark ? "rgba(255,255,255,0.04)" : "#f8fafc", pl: 0 }}>
                            {row.label}
                          </TableCell>
                          <TableCell align="right" sx={{ fontSize: 12, color: isDark ? "#94a3b8" : "#64748b", borderColor: isDark ? "rgba(255,255,255,0.04)" : "#f8fafc" }}>
                            {row.rate.toFixed(4)}
                          </TableCell>
                          <TableCell align="right" sx={{ fontSize: 12, fontWeight: 600, color: "#22c55e", borderColor: isDark ? "rgba(255,255,255,0.04)" : "#f8fafc" }}>
                            {row.kwh.toFixed(2)}
                          </TableCell>
                          <TableCell align="right" sx={{ fontSize: 12, fontWeight: 600, color: isDark ? "#e2e8f0" : "#1e293b", borderColor: isDark ? "rgba(255,255,255,0.04)" : "#f8fafc", pr: 0 }}>
                            N$ {row.cost.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Box sx={{ mt: 2, p: 2, borderRadius: 2, bgcolor: isDark ? "rgba(34,197,94,0.08)" : "rgba(34,197,94,0.05)", border: `1px solid ${isDark ? "rgba(34,197,94,0.15)" : "rgba(34,197,94,0.12)"}`, textAlign: "center" }}>
                  <Typography sx={{ fontSize: 11, color: isDark ? "#94a3b8" : "#64748b", mb: 0.3 }}>Total Energy</Typography>
                  <Typography sx={{ fontSize: 28, fontWeight: 700, color: "#22c55e" }}>
                    {costBreakdown.totalKwh.toFixed(2)} <span style={{ fontSize: 13, fontWeight: 400 }}>kWh</span>
                  </Typography>
                  <Typography sx={{ fontSize: 10, color: isDark ? "#64748b" : "#94a3b8", mt: 0.5 }}>
                    {costBreakdown.tariffName} ({costBreakdown.tariffType}) - {costBreakdown.currentPeriod} period
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          )}

          {!costBreakdown && costAmount && parseFloat(costAmount) > 0 && !tariffInfo && (
            <Typography sx={{ color: isDark ? "#475569" : "#94a3b8", fontSize: 13, textAlign: "center", py: 4 }}>
              Loading tariff data...
            </Typography>
          )}
        </Paper>
      )}
    </Box>
  );
}

export default Recharge;

import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Box, Typography, Paper, Grid, Chip, LinearProgress, IconButton, Tooltip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useData } from "../Data/getData";
import AuthContext from "../../../context/AuthContext";
import { meterDataAPI, vendingAPI, meterHealthAPI, netMeteringAPI, actualEnergyAPI } from "../../../services/api";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import ThermostatRoundedIcon from "@mui/icons-material/ThermostatRounded";
import PowerRoundedIcon from "@mui/icons-material/PowerRounded";
import WaterDropRoundedIcon from "@mui/icons-material/WaterDropRounded";
import BatteryChargingFullRoundedIcon from "@mui/icons-material/BatteryChargingFullRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import SignalCellularAltRoundedIcon from "@mui/icons-material/SignalCellularAltRounded";
import ElectricMeterRoundedIcon from "@mui/icons-material/ElectricMeterRounded";
import SolarPowerRoundedIcon from "@mui/icons-material/SolarPowerRounded";
import Chart from "react-apexcharts";

const IMPORT_RATE = 2.45;
const EXPORT_RATE = 1.60;
const POLL_INTERVAL = 10000;

const flowKeyframes = `
@keyframes flowRight {
  0% { transform: translateX(-10px); opacity: 0; }
  15% { opacity: 1; }
  85% { opacity: 1; }
  100% { transform: translateX(calc(100% + 10px)); opacity: 0; }
}
@keyframes flowLeft {
  0% { transform: translateX(calc(100% + 10px)); opacity: 0; }
  15% { opacity: 1; }
  85% { opacity: 1; }
  100% { transform: translateX(-10px); opacity: 0; }
}
@keyframes pulseGlow {
  0%, 100% { opacity: 0.7; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.08); }
}
@keyframes pulseRing {
  0% { transform: scale(1); opacity: 0.4; }
  100% { transform: scale(1.8); opacity: 0; }
}
@keyframes meterPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(59,130,246,0.3); }
  50% { box-shadow: 0 0 20px 4px rgba(59,130,246,0.15); }
}
`;

function FlowArrow({ direction, color, speed, isDark }) {
  const isRight = direction === "right";
  const anim = isRight ? "flowRight" : "flowLeft";
  return (
    <Box sx={{ position: "relative", flex: 1, height: 40, display: "flex", alignItems: "center", mx: 1 }}>
      <Box sx={{
        position: "absolute", top: "50%", left: 0, right: 0, height: 2, transform: "translateY(-50%)",
        bgcolor: `${color}30`,
      }} />
      <Box sx={{
        position: "absolute", top: "50%", transform: "translateY(-50%)",
        [isRight ? "right" : "left"]: -2,
        width: 0, height: 0,
        borderTop: "7px solid transparent", borderBottom: "7px solid transparent",
        [isRight ? "borderLeft" : "borderRight"]: `10px solid ${color}`,
        filter: `drop-shadow(0 0 4px ${color})`,
        zIndex: 2,
      }} />
      {[0, 1, 2].map(i => (
        <Box key={i} sx={{
          position: "absolute", top: "50%", left: 0, transform: "translateY(-50%)",
          display: "flex", alignItems: "center",
          animation: `${anim} ${speed}s linear infinite`,
          animationDelay: `${i * speed / 3}s`,
        }}>
          <Box sx={{
            width: 8, height: 8, borderRadius: "50%",
            bgcolor: color, boxShadow: `0 0 10px ${color}, 0 0 3px ${color}`,
          }} />
          <Box sx={{
            width: 16, height: 2, bgcolor: color, ml: "-1px",
            boxShadow: `0 0 6px ${color}`,
            opacity: 0.7,
          }} />
        </Box>
      ))}
      <Box sx={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        bgcolor: isDark ? "#1e293b" : "#fff", border: `1px solid ${color}40`,
        borderRadius: 2, px: 1, py: 0.2, zIndex: 3,
      }}>
        <Typography sx={{ fontSize: 10, fontWeight: 700, color, whiteSpace: "nowrap" }}>
          {speed < 2 ? "HIGH" : speed < 2.2 ? "MED" : "LOW"}
        </Typography>
      </Box>
    </Box>
  );
}

function FlowNode({ icon, label, sublabel, color, bgColor, isDark, active, pulse }) {
  const mutedColor = isDark ? "#94a3b8" : "#64748b";
  return (
    <Box sx={{ textAlign: "center", minWidth: 80, position: "relative" }}>
      {pulse && active && (
        <Box sx={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          width: 68, height: 68, borderRadius: "50%",
          border: `2px solid ${color}`,
          animation: "pulseRing 2s ease-out infinite",
        }} />
      )}
      <Box sx={{
        width: 64, height: 64, borderRadius: "50%", mx: "auto", mb: 0.8,
        bgcolor: bgColor,
        border: `2px solid ${color}50`,
        display: "flex", alignItems: "center", justifyContent: "center",
        animation: active ? "pulseGlow 2.5s ease-in-out infinite" : "none",
        transition: "all 0.3s ease",
      }}>
        {icon}
      </Box>
      <Typography sx={{ fontSize: 11, fontWeight: 700, color: isDark ? "#e2e8f0" : "#1e293b", letterSpacing: 0.5 }}>
        {label}
      </Typography>
      {sublabel && (
        <Typography sx={{ fontSize: 10, color: mutedColor, mt: 0.2 }}>{sublabel}</Typography>
      )}
    </Box>
  );
}

function PowerFlowAnimation({ activePower, isDark, voltage, importKwh, exportKwh }) {
  const ap = parseFloat(activePower || 0);
  const isNeutral = ap === 0;
  const isExporting = ap < 0;
  const pw = Math.abs(ap);
  const speed = pw > 500 ? 1.5 : pw > 100 ? 2.0 : 2.6;

  const gridColor = "#3b82f6";
  const homeColor = isExporting ? "#22c55e" : "#f97316";
  const meterColor = "#8b5cf6";
  const idleColor = isDark ? "#475569" : "#94a3b8";

  const flowColor = isNeutral ? idleColor : isExporting ? "#22c55e" : "#f97316";
  const statusText = isNeutral ? "No Active Power Flow" : isExporting ? "Exporting to Grid" : "Importing from Grid";

  return (
    <Box>
      <style>{flowKeyframes}</style>
      <Box sx={{
        display: "flex", alignItems: "center", justifyContent: "center",
        mb: 2, py: 1,
      }}>
        <Box sx={{
          px: 2, py: 0.5, borderRadius: 3,
          bgcolor: `${flowColor}15`,
          border: `1px solid ${flowColor}30`,
          display: "flex", alignItems: "center", gap: 1,
        }}>
          <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: flowColor, animation: isNeutral ? "none" : "pulseGlow 1.5s ease-in-out infinite" }} />
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: flowColor, letterSpacing: 0.5 }}>
            {statusText}
          </Typography>
          {!isNeutral && (
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: flowColor }}>
              {pw.toFixed(0)} W
            </Typography>
          )}
        </Box>
      </Box>

      <Box sx={{
        display: "flex", alignItems: "center", justifyContent: "center",
        px: { xs: 1, sm: 2 }, py: 2,
      }}>
        <FlowNode
          icon={<BoltRoundedIcon sx={{ fontSize: 28, color: gridColor }} />}
          label="GRID"
          sublabel={voltage ? `${parseFloat(voltage).toFixed(0)}V` : null}
          color={gridColor}
          bgColor={isDark ? "rgba(59,130,246,0.12)" : "rgba(59,130,246,0.08)"}
          isDark={isDark}
          active={!isNeutral && !isExporting}
          pulse={!isNeutral && !isExporting}
        />

        {!isNeutral ? (
          <FlowArrow
            direction={isExporting ? "left" : "right"}
            color={flowColor}
            speed={speed}
            isDark={isDark}
          />
        ) : (
          <Box sx={{ flex: 1, height: 40, display: "flex", alignItems: "center", mx: 1, position: "relative" }}>
            <Box sx={{
              position: "absolute", top: "50%", left: 0, right: 0, height: 2,
              transform: "translateY(-50%)",
              bgcolor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
              borderRadius: 1,
            }} />
            <Box sx={{
              position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
              bgcolor: isDark ? "#1e293b" : "#fff", border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
              borderRadius: 2, px: 1, py: 0.2, zIndex: 3,
            }}>
              <Typography sx={{ fontSize: 10, fontWeight: 600, color: idleColor }}>IDLE</Typography>
            </Box>
          </Box>
        )}

        <FlowNode
          icon={<ElectricMeterRoundedIcon sx={{ fontSize: 28, color: meterColor }} />}
          label="METER"
          sublabel={`${pw.toFixed(0)} W`}
          color={meterColor}
          bgColor={isDark ? "rgba(139,92,246,0.12)" : "rgba(139,92,246,0.08)"}
          isDark={isDark}
          active={!isNeutral}
          pulse={false}
        />

        {!isNeutral ? (
          <FlowArrow
            direction={isExporting ? "left" : "right"}
            color={flowColor}
            speed={speed}
            isDark={isDark}
          />
        ) : (
          <Box sx={{ flex: 1, height: 40, display: "flex", alignItems: "center", mx: 1, position: "relative" }}>
            <Box sx={{
              position: "absolute", top: "50%", left: 0, right: 0, height: 2,
              transform: "translateY(-50%)",
              bgcolor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
              borderRadius: 1,
            }} />
          </Box>
        )}

        <FlowNode
          icon={<Box component="span" sx={{ fontSize: 26 }}>{"\u{1F3E0}"}</Box>}
          label="HOME"
          sublabel={isExporting ? "Solar" : "Load"}
          color={homeColor}
          bgColor={isDark ? `${homeColor}18` : `${homeColor}10`}
          isDark={isDark}
          active={!isNeutral && isExporting}
          pulse={!isNeutral && isExporting}
        />
      </Box>

      <Box sx={{
        display: "flex", justifyContent: "center", gap: 3, mt: 1,
      }}>
        <Box sx={{ textAlign: "center" }}>
          <Typography sx={{ fontSize: 10, color: isDark ? "#64748b" : "#94a3b8", mb: 0.2 }}>Lifetime Import</Typography>
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#f97316" }}>
            {importKwh != null ? importKwh.toFixed(2) : "—"} <span style={{ fontSize: 10, fontWeight: 400 }}>kWh</span>
          </Typography>
        </Box>
        <Box sx={{ width: 1, bgcolor: isDark ? "rgba(255,255,255,0.06)" : "#e2e8f0" }} />
        <Box sx={{ textAlign: "center" }}>
          <Typography sx={{ fontSize: 10, color: isDark ? "#64748b" : "#94a3b8", mb: 0.2 }}>Lifetime Export</Typography>
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#22c55e" }}>
            {exportKwh != null ? exportKwh.toFixed(2) : "—"} <span style={{ fontSize: 10, fontWeight: 400 }}>kWh</span>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

function EnergySummaryCard({ title, subtitle, totals, isDark }) {
  const subColor = isDark ? "#94a3b8" : "#64748b";
  const headerColor = isDark ? "#e2e8f0" : "#1e293b";
  const hasData = totals.importKwh > 0 || totals.exportKwh > 0;
  const totalKwh = totals.importKwh + totals.exportKwh;
  const importPct = totalKwh > 0 ? (totals.importKwh / totalKwh) * 100 : 50;
  const exportPct = totalKwh > 0 ? (totals.exportKwh / totalKwh) * 100 : 50;
  const isCredit = totals.netCost < 0;

  const donutOpts = {
    chart: { type: "donut", background: "transparent" },
    colors: ["#f97316", "#22c55e"],
    labels: ["Imported", "Exported"],
    plotOptions: {
      pie: {
        donut: {
          size: "72%",
          labels: { show: false },
        },
      },
    },
    stroke: { width: 2, colors: [isDark ? "#1e293b" : "#fff"] },
    dataLabels: { enabled: false },
    legend: { show: false },
    tooltip: {
      theme: isDark ? "dark" : "light",
      y: { formatter: (v) => v.toFixed(3) + " kWh" },
    },
  };

  const donutSeries = hasData ? [totals.importKwh, totals.exportKwh] : [0.001, 0.001];
  const netCostColor = isCredit ? "#22c55e" : "#f97316";

  return (
    <Paper elevation={0} sx={{
      borderRadius: 3, height: "100%", overflow: "hidden",
      bgcolor: isDark ? "rgba(30,41,59,0.6)" : "#fff",
      border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#e2e8f0"}`,
    }}>
      <Box sx={{
        px: 2.5, py: 1.5,
        bgcolor: isDark ? "rgba(59,130,246,0.08)" : "rgba(59,130,246,0.04)",
        borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#e2e8f0"}`,
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <Typography sx={{ fontSize: 14, fontWeight: 700, color: headerColor }}>
          {title} — Energy Summary
        </Typography>
        <Box sx={{
          px: 1.2, py: 0.3, borderRadius: 1.5,
          bgcolor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
        }}>
          <Typography sx={{ fontSize: 10, fontWeight: 600, color: subColor }}>{subtitle}</Typography>
        </Box>
      </Box>
      <Box sx={{ p: 2.5 }}>
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 1 }}>
        <Typography sx={{ fontSize: 10, color: "#f97316" }}>Import: N$ {IMPORT_RATE.toFixed(2)}/kWh</Typography>
        <Typography sx={{ fontSize: 10, color: "#22c55e" }}>Export: N$ {EXPORT_RATE.toFixed(2)}/kWh</Typography>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", mb: 1, position: "relative" }}>
        <Chart type="donut" width={200} height={200} options={donutOpts} series={donutSeries} />
        <Box sx={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          textAlign: "center", pointerEvents: "none",
        }}>
          <Typography sx={{ fontSize: 10, color: netCostColor, lineHeight: 1.2 }}>
            {isCredit ? "Credit" : "Net Cost"}
          </Typography>
          <Typography sx={{ fontSize: 18, fontWeight: 700, color: headerColor, lineHeight: 1.2 }}>
            N$ {Math.abs(totals.netCost).toFixed(2)}
          </Typography>
        </Box>
      </Box>

      <Box sx={{
        display: "flex", justifyContent: "center", gap: 2, mb: 2,
      }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#f97316" }} />
          <Typography sx={{ fontSize: 10, color: subColor }}>Import {importPct.toFixed(0)}%</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#22c55e" }} />
          <Typography sx={{ fontSize: 10, color: subColor }}>Export {exportPct.toFixed(0)}%</Typography>
        </Box>
      </Box>

      {[
        { label: "Import", val: `${totals.importKwh.toFixed(3)} kWh`, color: "#f97316" },
        { label: "Import Cost", val: `N$ ${totals.importCost.toFixed(2)}`, color: "#f97316" },
        { label: "Export", val: `${totals.exportKwh.toFixed(3)} kWh`, color: "#22c55e" },
        { label: "Export Credit", val: `N$ ${totals.exportCost.toFixed(2)}`, color: "#22c55e" },
        { label: "Net Cost", val: `${isCredit ? "-" : ""}N$ ${Math.abs(totals.netCost).toFixed(2)}`, color: isCredit ? "#22c55e" : "#f97316", bold: true },
      ].map((item, i) => (
        <Box key={i} sx={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          py: 0.8, borderBottom: i < 4 ? `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "#f1f5f9"}` : "none",
        }}>
          <Typography sx={{ fontSize: 12, color: subColor }}>{item.label}</Typography>
          <Typography sx={{ fontSize: 12, fontWeight: item.bold ? 700 : 600, color: item.color }}>
            {item.val}
          </Typography>
        </Box>
      ))}
      </Box>
    </Paper>
  );
}

function StatCard({ title, value, unit, icon, color, subtitle, isDark }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5, borderRadius: 3, height: "100%",
        bgcolor: isDark ? "rgba(30,41,59,0.6)" : "#fff",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#e2e8f0"}`,
        transition: "all 0.2s",
        "&:hover": { transform: "translateY(-2px)", boxShadow: isDark ? "0 8px 25px rgba(0,0,0,0.3)" : "0 8px 25px rgba(0,0,0,0.08)" },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <Box>
          <Typography sx={{ fontSize: 12, color: isDark ? "#94a3b8" : "#64748b", fontWeight: 500, mb: 0.5 }}>
            {title}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
            <Typography sx={{ fontSize: 28, fontWeight: 700, color: isDark ? "#f1f5f9" : "#0f172a", lineHeight: 1.2 }}>
              {value}
            </Typography>
            {unit && <Typography sx={{ fontSize: 13, color: isDark ? "#64748b" : "#94a3b8", fontWeight: 500 }}>{unit}</Typography>}
          </Box>
          {subtitle && (
            <Typography sx={{ fontSize: 11, color: isDark ? "#64748b" : "#94a3b8", mt: 0.5 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box sx={{
          width: 42, height: 42, borderRadius: 2,
          bgcolor: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {React.cloneElement(icon, { sx: { color, fontSize: 22 } })}
        </Box>
      </Box>
    </Paper>
  );
}

function EnergyBar({ value, max = 5000, isDark }) {
  const pct = Math.min((value / max) * 100, 100);
  const getColor = (p) => {
    if (p <= 20) return "#ef4444";
    if (p <= 50) return "#f97316";
    if (p <= 75) return "#eab308";
    return "#22c55e";
  };
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography sx={{ fontSize: 12, color: isDark ? "#94a3b8" : "#64748b" }}>Energy Balance</Typography>
        <Typography sx={{ fontSize: 12, fontWeight: 600, color: getColor(pct) }}>{value} kWh</Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={pct}
        sx={{
          height: 8, borderRadius: 4, bgcolor: isDark ? "rgba(255,255,255,0.06)" : "#f1f5f9",
          "& .MuiLinearProgress-bar": { borderRadius: 4, bgcolor: getColor(pct) },
        }}
      />
    </Box>
  );
}

function Dashboard() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { unitsData, averageUnitsData, loadData, powerData, hourlyData, signalStrengthData } = useData();
  const { userInfo } = useContext(AuthContext);
  const drn = userInfo?.DRN || JSON.parse(sessionStorage.getItem("user") || "{}")?.DRN || "";

  const [tariffInfo, setTariffInfo] = useState(null);
  const [healthData, setHealthData] = useState(null);
  const [location, setLocation] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [netLatest, setNetLatest] = useState(null);
  const [netHourly, setNetHourly] = useState(null);
  const [netDaily, setNetDaily] = useState(null);
  const [livePower, setLivePower] = useState(null);
  const [actualHourly, setActualHourly] = useState(null);
  const [actualDaily, setActualDaily] = useState(null);
  const [energySource, setEnergySource] = useState("estimated");
  const pollRef = useRef(null);

  useEffect(() => {
    if (!drn) return;
    vendingAPI.getTariffInfo(drn).then(d => setTariffInfo(d)).catch(() => {});
    meterHealthAPI.getLatest(drn).then(d => setHealthData(d?.data || d)).catch(() => {});
    meterDataAPI.getLocation(drn).then(d => setLocation(d?.data || d)).catch(() => {});
    netMeteringAPI.getLatest(drn).then(d => setNetLatest(d?.data || d)).catch(() => {});
    netMeteringAPI.getHourly(drn).then(d => setNetHourly(d?.data || d)).catch(() => {});
    netMeteringAPI.getDaily(drn, 400).then(d => setNetDaily(d?.data || d)).catch(() => {});
    meterDataAPI.getPower(drn).then(d => setLivePower(d)).catch(() => {});
    actualEnergyAPI.getHourly(drn).then(d => {
      const data = d?.data || d;
      setActualHourly(data);
      if (data?.hourly?.some(h => h.active_wh > 0)) setEnergySource("measured");
    }).catch(() => {});
    actualEnergyAPI.getDaily(drn, 400).then(d => setActualDaily(d?.data || d)).catch(() => {});
  }, [drn]);

  useEffect(() => {
    if (!drn) return;
    pollRef.current = setInterval(() => {
      meterDataAPI.getPower(drn).then(d => setLivePower(d)).catch(() => {});
    }, POLL_INTERVAL);
    return () => clearInterval(pollRef.current);
  }, [drn]);

  const handleRefresh = () => {
    setRefreshing(true);
    window.location.reload();
  };

  const fmt = (v, d = 1) => { const n = parseFloat(v); return isNaN(n) ? "---" : n.toFixed(d); };
  const voltage = fmt(powerData?.voltage || powerData?.Voltage);
  const current = fmt(powerData?.current || powerData?.Current, 2);
  const power = fmt(powerData?.power || powerData?.active_energy || powerData?.Power);
  const frequency = fmt((powerData?.frequency || powerData?.Frequency || 0) * 100, 1);

  const mainsState = String(loadData?.mains_state) === "1";
  const geyserState = String(loadData?.geyser_state) === "1";

  const hasActual = actualHourly?.hourly?.some(h => h.active_wh > 0);

  const todayUsage = (() => {
    if (hasActual) {
      const net = (actualHourly.total_import_wh - actualHourly.total_export_wh) / 1000;
      return net.toFixed(2);
    }
    if (netHourly?.hourly) {
      const net = netHourly.hourly.reduce((sum, h) => sum + ((h.import || 0) - (h.export || 0)), 0) / 1000;
      return net.toFixed(2);
    }
    return Array.isArray(hourlyData)
      ? hourlyData.reduce((sum, h) => sum + (parseFloat(h.kWh) || 0), 0).toFixed(2)
      : (averageUnitsData || "0");
  })();

  const hourlyMap = {};
  if (hasActual) {
    actualHourly.hourly.forEach(h => {
      const label = `${String(h.hour).padStart(2, "0")}:00`;
      hourlyMap[label] = (h.import_wh - h.export_wh) / 1000;
    });
  } else if (netHourly?.hourly) {
    netHourly.hourly.forEach(h => {
      const label = `${String(h.hour).padStart(2, "0")}:00`;
      hourlyMap[label] = ((h.import || 0) - (h.export || 0)) / 1000;
    });
  } else if (Array.isArray(hourlyData)) {
    hourlyData.forEach(d => {
      const h = d.hour || d.Hour || "";
      hourlyMap[h] = parseFloat(d.kWh || d.energy || d.Energy || 0);
    });
  }
  const chartData = Array.from({ length: 24 }, (_, i) => {
    const label = `${String(i).padStart(2, "0")}:00`;
    return { x: label, y: hourlyMap[label] || hourlyMap[i] || hourlyMap[String(i)] || 0 };
  });

  const todayImportKwh = (() => {
    if (hasActual) return actualHourly.total_import_wh / 1000;
    if (!netHourly?.hourly) return 0;
    return netHourly.hourly.reduce((sum, h) => sum + (h.import || 0), 0) / 1000;
  })();
  const todayExportKwh = (() => {
    if (hasActual) return actualHourly.total_export_wh / 1000;
    if (!netHourly?.hourly) return 0;
    return netHourly.hourly.reduce((sum, h) => sum + (h.export || 0), 0) / 1000;
  })();

  const chartOpts = {
    chart: { type: "line", toolbar: { show: false }, background: "transparent" },
    stroke: { curve: "smooth", width: 2.5 },
    colors: ["#3b82f6"],
    markers: { size: 3, strokeWidth: 0, hover: { size: 5 } },
    fill: {
      type: "gradient",
      gradient: { shadeIntensity: 1, opacityFrom: 0.25, opacityTo: 0.05, stops: [0, 90, 100] },
    },
    xaxis: {
      categories: chartData.map(d => d.x),
      labels: { style: { colors: isDark ? "#64748b" : "#94a3b8", fontSize: "9px" }, rotate: -45 },
      axisBorder: { show: false }, axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { colors: isDark ? "#64748b" : "#94a3b8", fontSize: "10px" },
        formatter: (v) => v.toFixed(2),
      },
      title: { text: "kWh", style: { color: isDark ? "#64748b" : "#94a3b8", fontSize: "11px" } },
    },
    grid: { borderColor: isDark ? "rgba(255,255,255,0.04)" : "#f1f5f9", strokeDashArray: 4 },
    tooltip: {
      theme: isDark ? "dark" : "light",
      y: { formatter: (v) => `${v >= 0 ? "Import" : "Export"}: ${Math.abs(v).toFixed(3)} kWh` },
    },
    dataLabels: { enabled: false },
  };

  return (
    <Box sx={{ maxHeight: "calc(100vh - 80px)", overflowY: "auto", pb: 4, px: { xs: 0, sm: 1 } }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
        <Box>
          <Typography variant="h2" sx={{ color: isDark ? "#f1f5f9" : "#0f172a" }}>
            Dashboard
          </Typography>
          <Typography sx={{ color: isDark ? "#64748b" : "#94a3b8", fontSize: 13 }}>
            Welcome back{userInfo?.FirstName ? `, ${userInfo.FirstName}` : ""}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Chip
            icon={<PowerRoundedIcon />}
            label={mainsState ? "Mains ON" : "Mains OFF"}
            size="small"
            sx={{
              fontWeight: 600, fontSize: 12,
              bgcolor: mainsState ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
              color: mainsState ? "#22c55e" : "#ef4444",
              border: `1px solid ${mainsState ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
              "& .MuiChip-icon": { color: "inherit" },
            }}
          />
          <Chip
            icon={<WaterDropRoundedIcon />}
            label={geyserState ? "Heater ON" : "Heater OFF"}
            size="small"
            sx={{
              fontWeight: 600, fontSize: 12,
              bgcolor: geyserState ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
              color: geyserState ? "#22c55e" : "#ef4444",
              border: `1px solid ${geyserState ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
              "& .MuiChip-icon": { color: "inherit" },
            }}
          />
          <Tooltip title="Refresh">
            <IconButton size="small" onClick={handleRefresh} sx={{ color: isDark ? "#94a3b8" : "#64748b" }}>
              <RefreshRoundedIcon fontSize="small" sx={{ animation: refreshing ? "spin 1s linear infinite" : "none", "@keyframes spin": { "100%": { transform: "rotate(360deg)" } } }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={6} md={4}>
          <StatCard title="Meter Units" value={unitsData || "0"} unit="kWh" icon={<ElectricMeterRoundedIcon />} color="#3b82f6" isDark={isDark} />
        </Grid>
        <Grid item xs={6} sm={6} md={4}>
          <StatCard title="Today's Net Usage" value={todayUsage} unit="kWh" icon={<BoltRoundedIcon />} color="#f97316" isDark={isDark} />
        </Grid>
        <Grid item xs={6} sm={6} md={4}>
          <StatCard title="Current Power" value={power} unit="W" icon={<BatteryChargingFullRoundedIcon />} color="#10b981" isDark={isDark} />
        </Grid>
        <Grid item xs={6} sm={6} md={6}>
          <StatCard title="Today's Import" value={todayImportKwh.toFixed(3)} unit="kWh" icon={<TrendingDownRoundedIcon />} color="#f97316" subtitle={`Cost: N$ ${(todayImportKwh * IMPORT_RATE).toFixed(2)}`} isDark={isDark} />
        </Grid>
        <Grid item xs={6} sm={6} md={6}>
          <StatCard title="Today's Export" value={todayExportKwh.toFixed(3)} unit="kWh" icon={<TrendingUpRoundedIcon />} color="#22c55e" subtitle={`Credit: N$ ${(todayExportKwh * EXPORT_RATE).toFixed(2)}`} isDark={isDark} />
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{
            p: 2.5, borderRadius: 3, height: "100%",
            bgcolor: isDark ? "rgba(30,41,59,0.6)" : "#fff",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#e2e8f0"}`,
          }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Typography sx={{ fontSize: 15, fontWeight: 600, color: isDark ? "#e2e8f0" : "#1e293b" }}>
                Energy Consumption (Today)
              </Typography>
              <Chip
                size="small"
                label={hasActual ? "Measured" : "Estimated"}
                sx={{
                  fontSize: 9, fontWeight: 600, height: 20,
                  bgcolor: hasActual ? "rgba(34,197,94,0.1)" : "rgba(249,115,22,0.1)",
                  color: hasActual ? "#22c55e" : "#f97316",
                  border: `1px solid ${hasActual ? "rgba(34,197,94,0.2)" : "rgba(249,115,22,0.2)"}`,
                }}
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2, mb: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: 1, bgcolor: "#f97316" }} />
                <Typography sx={{ fontSize: 10, color: isDark ? "#94a3b8" : "#64748b" }}>Import (from grid)</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: 1, bgcolor: "#22c55e" }} />
                <Typography sx={{ fontSize: 10, color: isDark ? "#94a3b8" : "#64748b" }}>Export (to grid)</Typography>
              </Box>
            </Box>
            <Chart type="area" height={220} options={chartOpts} series={[{ name: "Net Energy", data: chartData.map(d => d.y) }]} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{
            p: 2.5, borderRadius: 3, height: "100%",
            bgcolor: isDark ? "rgba(30,41,59,0.6)" : "#fff",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#e2e8f0"}`,
          }}>
            <Typography sx={{ fontSize: 15, fontWeight: 600, mb: 2.5, color: isDark ? "#e2e8f0" : "#1e293b" }}>
              Live Readings
            </Typography>
            {[
              { label: "Power", val: power, unit: "W", color: "#f97316" },
              { label: "Voltage", val: voltage, unit: "V", color: "#3b82f6" },
              { label: "Current", val: current, unit: "A", color: "#10b981" },
              { label: "Frequency", val: frequency, unit: "Hz", color: "#8b5cf6" },
              { label: "Signal", val: signalStrengthData ? `${signalStrengthData}` : "---", unit: "dBm", color: "#eab308" },
            ].map((item, i) => (
              <Box key={i} sx={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                py: 1.2, borderBottom: i < 4 ? `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "#f1f5f9"}` : "none",
              }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: item.color }} />
                  <Typography sx={{ fontSize: 13, color: isDark ? "#94a3b8" : "#64748b" }}>{item.label}</Typography>
                </Box>
                <Typography sx={{ fontSize: 14, fontWeight: 600, color: isDark ? "#e2e8f0" : "#1e293b" }}>
                  {item.val} <span style={{ fontSize: 11, fontWeight: 400, color: isDark ? "#64748b" : "#94a3b8" }}>{item.unit}</span>
                </Typography>
              </Box>
            ))}

            <Box sx={{ mt: 2.5 }}>
              <EnergyBar value={parseFloat(unitsData) || 0} max={5000} isDark={isDark} />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* TOTAL HOME CONSUMPTION LINE CHART */}
      {(() => {
        const totalConsData = Array.from({ length: 24 }, (_, i) => {
          const label = `${String(i).padStart(2, "0")}:00`;
          if (hasActual) {
            const ah = actualHourly.hourly.find(r => r.hour === i);
            return { x: label, y: ah ? parseFloat((ah.active_wh / 1000).toFixed(3)) : 0 };
          }
          const regularKwh = hourlyMap[label] || hourlyMap[i] || hourlyMap[String(i)] || 0;
          const netHour = netHourly?.hourly?.find(r => r.hour === i);
          const importKwh = netHour ? netHour.import / 1000 : 0;
          const exportKwh = netHour ? netHour.export / 1000 : 0;
          const solarSelf = Math.max(0, regularKwh - importKwh);
          const total = importKwh + solarSelf + (exportKwh > 0 && regularKwh === 0 ? exportKwh * 0.5 : 0);
          return { x: label, y: parseFloat(Math.max(regularKwh, total).toFixed(3)) };
        });
        const totalConsOpts = {
          chart: { type: "line", toolbar: { show: false }, background: "transparent" },
          stroke: { curve: "smooth", width: 2.5 },
          colors: ["#8b5cf6"],
          markers: { size: 3, strokeWidth: 0, hover: { size: 5 } },
          xaxis: {
            categories: totalConsData.map(d => d.x),
            labels: { style: { colors: isDark ? "#64748b" : "#94a3b8", fontSize: "9px" }, rotate: -45 },
            axisBorder: { show: false }, axisTicks: { show: false },
          },
          yaxis: {
            labels: {
              style: { colors: isDark ? "#64748b" : "#94a3b8", fontSize: "10px" },
              formatter: (v) => v.toFixed(2),
            },
            title: { text: "kWh", style: { color: isDark ? "#64748b" : "#94a3b8", fontSize: "11px" } },
          },
          grid: { borderColor: isDark ? "rgba(255,255,255,0.04)" : "#f1f5f9", strokeDashArray: 4 },
          tooltip: { theme: isDark ? "dark" : "light", y: { formatter: (v) => v.toFixed(3) + " kWh" } },
          dataLabels: { enabled: false },
        };
        return (
          <Paper elevation={0} sx={{
            p: 2.5, borderRadius: 3, mb: 3,
            bgcolor: isDark ? "rgba(30,41,59,0.6)" : "#fff",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#e2e8f0"}`,
          }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Typography sx={{ fontSize: 15, fontWeight: 600, color: isDark ? "#e2e8f0" : "#1e293b" }}>
                Total Home Consumption (Today)
              </Typography>
              <Chip
                size="small"
                label={hasActual ? "Measured" : "Estimated"}
                sx={{
                  fontSize: 9, fontWeight: 600, height: 20,
                  bgcolor: hasActual ? "rgba(34,197,94,0.1)" : "rgba(249,115,22,0.1)",
                  color: hasActual ? "#22c55e" : "#f97316",
                  border: `1px solid ${hasActual ? "rgba(34,197,94,0.2)" : "rgba(249,115,22,0.2)"}`,
                }}
              />
            </Box>
            <Typography sx={{ fontSize: 11, color: isDark ? "#64748b" : "#94a3b8", mb: 1, mt: -1 }}>
              {hasActual ? "Actual measured energy from meter registers" : "Combined energy from grid and solar — total load on the home"}
            </Typography>
            <Chart type="line" height={220} options={totalConsOpts} series={[{ name: "Total kWh", data: totalConsData.map(d => d.y) }]} />
          </Paper>
        );
      })()}

      {/* LIVE POWER FLOW */}
      {(() => {
        const lp = parseFloat(livePower?.active_power || powerData?.active_energy || powerData?.Power || 0);
        const isExp = lp < 0;
        const isNeutral = lp === 0;
        const importWh = parseFloat(netLatest?.import_energy_wh || 0);
        const exportWh = parseFloat(netLatest?.export_energy_wh || 0);

        const subColor = isDark ? "#94a3b8" : "#64748b";
        const cardBg = isDark ? "rgba(30,41,59,0.6)" : "#fff";
        const cardBorder = `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#e2e8f0"}`;
        const headerColor = isDark ? "#e2e8f0" : "#1e293b";
        const rowAlt = isDark ? "rgba(255,255,255,0.02)" : "#f8fafc";

        const statusColor = isNeutral ? (isDark ? "#475569" : "#94a3b8") : isExp ? "#22c55e" : "#f97316";
        const statusLabel = isNeutral ? "Idle" : isExp ? "Exporting" : "Importing";
        const StatusIcon = isNeutral ? BoltRoundedIcon : isExp ? TrendingUpRoundedIcon : TrendingDownRoundedIcon;

        const hourlyRows = (() => {
          if (!netHourly?.hourly) return [];
          return netHourly.hourly
            .filter(h => h.import > 0 || h.export > 0)
            .map(h => {
              const impKwh = h.import / 1000;
              const expKwh = h.export / 1000;
              return {
                hour: `${String(h.hour).padStart(2, "0")}:00`,
                importKwh: impKwh,
                importCost: impKwh * IMPORT_RATE,
                exportKwh: expKwh,
                exportCost: expKwh * EXPORT_RATE,
                netCost: (impKwh * IMPORT_RATE) - (expKwh * EXPORT_RATE),
              };
            });
        })();

        const dayTotals = hourlyRows.reduce((acc, r) => ({
          importKwh: acc.importKwh + r.importKwh,
          importCost: acc.importCost + r.importCost,
          exportKwh: acc.exportKwh + r.exportKwh,
          exportCost: acc.exportCost + r.exportCost,
          netCost: acc.netCost + r.netCost,
        }), { importKwh: 0, importCost: 0, exportKwh: 0, exportCost: 0, netCost: 0 });

        const monthTotals = (() => {
          const now = new Date();
          const thisMonth = now.getMonth();
          const thisYear = now.getFullYear();
          const todayStr = now.toISOString().split("T")[0];
          const zero = { importKwh: 0, importCost: 0, exportKwh: 0, exportCost: 0, netCost: 0 };
          const addEntry = (acc, ik, ek) => ({
            importKwh: acc.importKwh + ik,
            importCost: acc.importCost + ik * IMPORT_RATE,
            exportKwh: acc.exportKwh + ek,
            exportCost: acc.exportCost + ek * EXPORT_RATE,
            netCost: acc.netCost + (ik * IMPORT_RATE - ek * EXPORT_RATE),
          });

          const actualRows = actualDaily?.history || [];
          const netRows = netDaily?.history || [];
          const inMonth = (r) => { const d = new Date(r.date); return d.getMonth() === thisMonth && d.getFullYear() === thisYear; };
          const isToday = (r) => r.date === todayStr || new Date(r.date).toISOString().split("T")[0] === todayStr;

          const actualDates = new Set(actualRows.filter(r => inMonth(r) && !isToday(r)).map(r => new Date(r.date).toISOString().split("T")[0]));

          let pastDays = actualRows
            .filter(r => inMonth(r) && !isToday(r))
            .reduce((acc, r) => addEntry(acc, (r.import_wh || 0) / 1000, (r.export_wh || 0) / 1000), { ...zero });

          netRows
            .filter(r => inMonth(r) && !isToday(r) && !actualDates.has(new Date(r.date).toISOString().split("T")[0]))
            .forEach(r => { pastDays = addEntry(pastDays, (r.import || 0) / 1000, (r.export || 0) / 1000); });

          return addEntry(pastDays, dayTotals.importKwh, dayTotals.exportKwh);
        })();

        return (
          <>
            <Paper elevation={0} sx={{ borderRadius: 3, mb: 3, bgcolor: cardBg, border: cardBorder, overflow: "hidden" }}>
              <Box sx={{
                px: 2.5, py: 1.5,
                bgcolor: isDark ? "rgba(59,130,246,0.08)" : "rgba(59,130,246,0.04)",
                borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#e2e8f0"}`,
                display: "flex", alignItems: "center", gap: 1,
              }}>
                <SolarPowerRoundedIcon sx={{ fontSize: 18, color: isDark ? "#60a5fa" : "#2563eb" }} />
                <Typography sx={{ fontSize: 15, fontWeight: 700, color: headerColor }}>
                  Live Power Flow
                </Typography>
                <Chip
                  size="small"
                  icon={<StatusIcon />}
                  label={statusLabel}
                  sx={{
                    ml: "auto", fontWeight: 600, fontSize: 11,
                    bgcolor: `${statusColor}18`,
                    color: statusColor,
                    border: `1px solid ${statusColor}30`,
                    "& .MuiChip-icon": { color: "inherit" },
                  }}
                />
              </Box>
              <Box sx={{ p: 2.5 }}>
                <PowerFlowAnimation
                  activePower={lp}
                  isDark={isDark}
                  voltage={livePower?.voltage || powerData?.voltage}
                  importKwh={importWh / 1000}
                  exportKwh={exportWh / 1000}
                />
              </Box>
              <Box sx={{
                px: 2.5, py: 1,
                bgcolor: isDark ? "rgba(255,255,255,0.02)" : "#f8fafc",
                borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "#f1f5f9"}`,
              }}>
                <Typography sx={{ fontSize: 10, color: subColor, textAlign: "center", fontStyle: "italic" }}>
                  Imported and Exported values are cumulative totals from the meter registers (all-time)
                </Typography>
              </Box>
            </Paper>

            {/* TODAY & THIS MONTH SUMMARY CARDS WITH DONUT CHARTS */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <EnergySummaryCard
                  title="Today"
                  subtitle={new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                  totals={dayTotals}
                  isDark={isDark}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <EnergySummaryCard
                  title={`${new Date().toLocaleString("default", { month: "long" })} ${new Date().getFullYear()}`}
                  subtitle={`1 — ${new Date().getDate()} ${new Date().toLocaleString("default", { month: "short" })} ${new Date().getFullYear()}`}
                  totals={monthTotals}
                  isDark={isDark}
                />
              </Grid>
            </Grid>

            {/* HOURLY IMPORT/EXPORT BAR CHART */}
            {(() => {
              const all24 = Array.from({ length: 24 }, (_, i) => {
                const label = `${String(i).padStart(2, "0")}:00`;
                const h = netHourly?.hourly?.find(r => r.hour === i);
                return {
                  label,
                  importKwh: h ? h.import / 1000 : 0,
                  exportKwh: h ? h.export / 1000 : 0,
                };
              });
              return (
                <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, mb: 3, bgcolor: cardBg, border: cardBorder }}>
                  <Typography sx={{ fontSize: 15, fontWeight: 600, mb: 2, color: headerColor }}>
                    Hourly Import vs Export
                  </Typography>
                  <Chart
                    type="bar" height={300}
                    options={{
                      chart: { type: "bar", toolbar: { show: false }, background: "transparent" },
                      colors: ["#f97316", "#22c55e"],
                      plotOptions: { bar: { borderRadius: 3, columnWidth: "60%" } },
                      xaxis: {
                        categories: all24.map(r => r.label),
                        labels: { style: { colors: isDark ? "#64748b" : "#94a3b8", fontSize: "9px" }, rotate: -45 },
                        axisBorder: { show: false }, axisTicks: { show: false },
                      },
                      yaxis: {
                        labels: {
                          style: { colors: isDark ? "#64748b" : "#94a3b8", fontSize: "10px" },
                          formatter: (v) => v.toFixed(3),
                        },
                        title: { text: "kWh", style: { color: isDark ? "#64748b" : "#94a3b8", fontSize: "11px" } },
                      },
                      grid: { borderColor: isDark ? "rgba(255,255,255,0.04)" : "#f1f5f9", strokeDashArray: 4 },
                      tooltip: { theme: isDark ? "dark" : "light", y: { formatter: (v) => v.toFixed(3) + " kWh" } },
                      dataLabels: { enabled: false },
                      legend: { labels: { colors: isDark ? "#94a3b8" : "#64748b" }, position: "top" },
                    }}
                    series={[
                      { name: "Imported (kWh)", data: all24.map(r => parseFloat(r.importKwh.toFixed(3))) },
                      { name: "Exported (kWh)", data: all24.map(r => parseFloat(r.exportKwh.toFixed(3))) },
                    ]}
                  />
                </Paper>
              );
            })()}

            {/* TODAY'S HOURLY IMPORT/EXPORT COST */}
            <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, mb: 3, bgcolor: cardBg, border: cardBorder }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", mb: 2, gap: 1 }}>
                <Typography sx={{ fontSize: 15, fontWeight: 600, color: headerColor }}>
                  Today's Hourly Breakdown
                </Typography>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Chip size="small" label={`Import Rate: N$ ${IMPORT_RATE.toFixed(2)}/kWh`} sx={{ fontSize: 10, fontWeight: 600, bgcolor: "rgba(249,115,22,0.1)", color: "#f97316", border: "1px solid rgba(249,115,22,0.2)" }} />
                  <Chip size="small" label={`Export Rate: N$ ${EXPORT_RATE.toFixed(2)}/kWh`} sx={{ fontSize: 10, fontWeight: 600, bgcolor: "rgba(34,197,94,0.1)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.2)" }} />
                </Box>
              </Box>
              <Box sx={{ overflowX: "auto" }}>
                <Box component="table" sx={{
                  width: "100%", borderCollapse: "collapse", fontSize: 12,
                  "& th": { textAlign: "left", py: 1, px: 1.5, color: subColor, fontWeight: 600, fontSize: 11, borderBottom: `2px solid ${isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0"}` },
                  "& td": { py: 1, px: 1.5, color: isDark ? "#e2e8f0" : "#1e293b", fontSize: 12, borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "#f1f5f9"}` },
                }}>
                  <thead>
                    <tr>
                      <th>Hour</th>
                      <th style={{ textAlign: "right" }}>Import (kWh)</th>
                      <th style={{ textAlign: "right" }}>Import Cost (N$)</th>
                      <th style={{ textAlign: "right" }}>Export (kWh)</th>
                      <th style={{ textAlign: "right" }}>Export Credit (N$)</th>
                      <th style={{ textAlign: "right" }}>Net Cost (N$)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hourlyRows.length > 0 ? hourlyRows.map((r, i) => (
                      <tr key={i} style={{ background: i % 2 === 0 ? rowAlt : "transparent" }}>
                        <td style={{ fontFamily: "monospace" }}>{r.hour}</td>
                        <td style={{ textAlign: "right", color: "#f97316", fontWeight: 600 }}>{r.importKwh.toFixed(3)}</td>
                        <td style={{ textAlign: "right", color: "#f97316" }}>{r.importCost.toFixed(2)}</td>
                        <td style={{ textAlign: "right", color: "#22c55e", fontWeight: 600 }}>{r.exportKwh.toFixed(3)}</td>
                        <td style={{ textAlign: "right", color: "#22c55e" }}>{r.exportCost.toFixed(2)}</td>
                        <td style={{ textAlign: "right", fontWeight: 700, color: r.netCost > 0 ? "#f97316" : "#22c55e" }}>
                          {r.netCost > 0 ? "" : "-"}{Math.abs(r.netCost).toFixed(2)}
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan={6} style={{ textAlign: "center", color: subColor, py: 20 }}>No hourly data yet today</td></tr>
                    )}
                    {hourlyRows.length > 0 && (
                      <tr style={{ background: isDark ? "rgba(59,130,246,0.08)" : "rgba(59,130,246,0.04)" }}>
                        <td style={{ fontWeight: 700 }}>Total</td>
                        <td style={{ textAlign: "right", fontWeight: 700, color: "#f97316" }}>{dayTotals.importKwh.toFixed(3)}</td>
                        <td style={{ textAlign: "right", fontWeight: 700, color: "#f97316" }}>{dayTotals.importCost.toFixed(2)}</td>
                        <td style={{ textAlign: "right", fontWeight: 700, color: "#22c55e" }}>{dayTotals.exportKwh.toFixed(3)}</td>
                        <td style={{ textAlign: "right", fontWeight: 700, color: "#22c55e" }}>{dayTotals.exportCost.toFixed(2)}</td>
                        <td style={{ textAlign: "right", fontWeight: 700, color: dayTotals.netCost > 0 ? "#f97316" : "#22c55e" }}>
                          {dayTotals.netCost > 0 ? "" : "-"}{Math.abs(dayTotals.netCost).toFixed(2)}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Box>
              </Box>
            </Paper>

            {/* WEEKLY POWER CONSUMPTION - IMPORT & EXPORT (kWh) */}
            {(() => {
              const weekData = (() => {
                const today = new Date();
                const days = [];
                for (let i = 6; i >= 0; i--) {
                  const d = new Date(today);
                  d.setDate(d.getDate() - i);
                  days.push(d);
                }
                return days.map(d => {
                  const dateStr = d.toISOString().split("T")[0];
                  const isToday = dateStr === today.toISOString().split("T")[0];
                  const dayLabel = d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
                  if (isToday) {
                    return { label: `Today (${dayLabel})`, importKwh: dayTotals.importKwh, exportKwh: dayTotals.exportKwh };
                  }
                  const actualRow = actualDaily?.history?.find(r => (r.date || "").startsWith(dateStr));
                  if (actualRow) {
                    return { label: dayLabel, importKwh: (actualRow.import_wh || 0) / 1000, exportKwh: (actualRow.export_wh || 0) / 1000 };
                  }
                  const netRow = netDaily?.history?.find(r => (r.date || "").startsWith(dateStr));
                  return { label: dayLabel, importKwh: netRow ? (netRow.import || 0) / 1000 : 0, exportKwh: netRow ? (netRow.export || 0) / 1000 : 0 };
                });
              })();
              return (
                <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, mb: 3, bgcolor: cardBg, border: cardBorder }}>
                  <Typography sx={{ fontSize: 15, fontWeight: 600, mb: 2, color: headerColor }}>
                    Weekly Power Consumption (kWh)
                  </Typography>
                  <Chart
                    type="bar" height={300}
                    options={{
                      chart: { type: "bar", toolbar: { show: false }, background: "transparent" },
                      colors: ["#f97316", "#22c55e"],
                      plotOptions: { bar: { borderRadius: 4, columnWidth: "55%" } },
                      xaxis: {
                        categories: weekData.map(r => r.label),
                        labels: { style: { colors: isDark ? "#64748b" : "#94a3b8", fontSize: "10px" } },
                        axisBorder: { show: false }, axisTicks: { show: false },
                      },
                      yaxis: {
                        labels: {
                          style: { colors: isDark ? "#64748b" : "#94a3b8", fontSize: "10px" },
                          formatter: (v) => v.toFixed(2),
                        },
                        title: { text: "kWh", style: { color: isDark ? "#64748b" : "#94a3b8", fontSize: "11px" } },
                      },
                      grid: { borderColor: isDark ? "rgba(255,255,255,0.04)" : "#f1f5f9", strokeDashArray: 4 },
                      tooltip: { theme: isDark ? "dark" : "light", y: { formatter: (v) => v.toFixed(3) + " kWh" } },
                      dataLabels: { enabled: false },
                      legend: { labels: { colors: isDark ? "#94a3b8" : "#64748b" }, position: "top" },
                    }}
                    series={[
                      { name: "Imported (kWh)", data: weekData.map(r => parseFloat(r.importKwh.toFixed(3))) },
                      { name: "Exported (kWh)", data: weekData.map(r => parseFloat(r.exportKwh.toFixed(3))) },
                    ]}
                  />
                </Paper>
              );
            })()}

            {/* WEEKLY COST - IMPORT COST & EXPORT CREDIT (N$) */}
            {(() => {
              const weekCostData = (() => {
                const today = new Date();
                const days = [];
                for (let i = 6; i >= 0; i--) {
                  const d = new Date(today);
                  d.setDate(d.getDate() - i);
                  days.push(d);
                }
                return days.map(d => {
                  const dateStr = d.toISOString().split("T")[0];
                  const isToday = dateStr === today.toISOString().split("T")[0];
                  const dayLabel = d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
                  let impKwh, expKwh;
                  if (isToday) {
                    impKwh = dayTotals.importKwh;
                    expKwh = dayTotals.exportKwh;
                  } else {
                    const actualRow = actualDaily?.history?.find(r => (r.date || "").startsWith(dateStr));
                    if (actualRow) {
                      impKwh = (actualRow.import_wh || 0) / 1000;
                      expKwh = (actualRow.export_wh || 0) / 1000;
                    } else {
                      const netRow = netDaily?.history?.find(r => (r.date || "").startsWith(dateStr));
                      impKwh = netRow ? (netRow.import || 0) / 1000 : 0;
                      expKwh = netRow ? (netRow.export || 0) / 1000 : 0;
                    }
                  }
                  return { label: isToday ? `Today (${dayLabel})` : dayLabel, importCost: impKwh * IMPORT_RATE, exportCredit: expKwh * EXPORT_RATE };
                });
              })();
              return (
                <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, mb: 3, bgcolor: cardBg, border: cardBorder }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", mb: 2, gap: 1 }}>
                    <Typography sx={{ fontSize: 15, fontWeight: 600, color: headerColor }}>
                      Weekly Cost Breakdown (N$)
                    </Typography>
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Chip size="small" label={`Import: N$ ${IMPORT_RATE.toFixed(2)}/kWh`} sx={{ fontSize: 10, fontWeight: 600, bgcolor: "rgba(249,115,22,0.1)", color: "#f97316", border: "1px solid rgba(249,115,22,0.2)" }} />
                      <Chip size="small" label={`Export: N$ ${EXPORT_RATE.toFixed(2)}/kWh`} sx={{ fontSize: 10, fontWeight: 600, bgcolor: "rgba(34,197,94,0.1)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.2)" }} />
                    </Box>
                  </Box>
                  <Chart
                    type="bar" height={300}
                    options={{
                      chart: { type: "bar", toolbar: { show: false }, background: "transparent" },
                      colors: ["#f97316", "#22c55e"],
                      plotOptions: { bar: { borderRadius: 4, columnWidth: "55%" } },
                      xaxis: {
                        categories: weekCostData.map(r => r.label),
                        labels: { style: { colors: isDark ? "#64748b" : "#94a3b8", fontSize: "10px" } },
                        axisBorder: { show: false }, axisTicks: { show: false },
                      },
                      yaxis: {
                        labels: {
                          style: { colors: isDark ? "#64748b" : "#94a3b8", fontSize: "10px" },
                          formatter: (v) => `N$ ${v.toFixed(2)}`,
                        },
                        title: { text: "N$", style: { color: isDark ? "#64748b" : "#94a3b8", fontSize: "11px" } },
                      },
                      grid: { borderColor: isDark ? "rgba(255,255,255,0.04)" : "#f1f5f9", strokeDashArray: 4 },
                      tooltip: { theme: isDark ? "dark" : "light", y: { formatter: (v) => `N$ ${v.toFixed(2)}` } },
                      dataLabels: { enabled: false },
                      legend: { labels: { colors: isDark ? "#94a3b8" : "#64748b" }, position: "top" },
                    }}
                    series={[
                      { name: "Import Cost (N$)", data: weekCostData.map(r => parseFloat(r.importCost.toFixed(2))) },
                      { name: "Export Credit (N$)", data: weekCostData.map(r => parseFloat(r.exportCredit.toFixed(2))) },
                    ]}
                  />
                </Paper>
              );
            })()}
          </>
        );
      })()}

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={0} sx={{
            p: 2.5, borderRadius: 3,
            bgcolor: isDark ? "rgba(30,41,59,0.6)" : "#fff",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#e2e8f0"}`,
          }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <AccessTimeRoundedIcon sx={{ fontSize: 18, color: isDark ? "#60a5fa" : "#2563eb" }} />
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: isDark ? "#e2e8f0" : "#1e293b" }}>
                Tariff Info
              </Typography>
            </Box>
            {tariffInfo ? (
              <Box>
                {[
                  { label: "Tariff Type", val: tariffInfo.tariff_type || tariffInfo.tariffType || "Standard" },
                  { label: "Rate", val: tariffInfo.rate ? `R ${tariffInfo.rate}/kWh` : "N/A" },
                  { label: "Period", val: tariffInfo.current_period || tariffInfo.period || "N/A" },
                ].map((item, i) => (
                  <Box key={i} sx={{ display: "flex", justifyContent: "space-between", py: 0.8 }}>
                    <Typography sx={{ fontSize: 12, color: isDark ? "#94a3b8" : "#64748b" }}>{item.label}</Typography>
                    <Typography sx={{ fontSize: 12, fontWeight: 600, color: isDark ? "#e2e8f0" : "#1e293b" }}>{item.val}</Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography sx={{ fontSize: 12, color: isDark ? "#475569" : "#94a3b8" }}>Loading...</Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={0} sx={{
            p: 2.5, borderRadius: 3,
            bgcolor: isDark ? "rgba(30,41,59,0.6)" : "#fff",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#e2e8f0"}`,
          }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <ThermostatRoundedIcon sx={{ fontSize: 18, color: isDark ? "#60a5fa" : "#2563eb" }} />
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: isDark ? "#e2e8f0" : "#1e293b" }}>
                Meter Health
              </Typography>
            </Box>
            {healthData ? (
              <Box>
                {[
                  { label: "Temperature", val: healthData.temperature ? `${parseFloat(healthData.temperature).toFixed(1)}°C` : "N/A" },
                  { label: "Signal", val: healthData.signal_strength ? `${healthData.signal_strength}%` : "N/A" },
                  { label: "Uptime", val: healthData.uptime || "N/A" },
                ].map((item, i) => (
                  <Box key={i} sx={{ display: "flex", justifyContent: "space-between", py: 0.8 }}>
                    <Typography sx={{ fontSize: 12, color: isDark ? "#94a3b8" : "#64748b" }}>{item.label}</Typography>
                    <Typography sx={{ fontSize: 12, fontWeight: 600, color: isDark ? "#e2e8f0" : "#1e293b" }}>{item.val}</Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography sx={{ fontSize: 12, color: isDark ? "#475569" : "#94a3b8" }}>Loading...</Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={0} sx={{
            p: 2.5, borderRadius: 3,
            bgcolor: isDark ? "rgba(30,41,59,0.6)" : "#fff",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#e2e8f0"}`,
          }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <LocationOnRoundedIcon sx={{ fontSize: 18, color: isDark ? "#60a5fa" : "#2563eb" }} />
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: isDark ? "#e2e8f0" : "#1e293b" }}>
                Location
              </Typography>
            </Box>
            {location ? (
              <Box>
                {[
                  { label: "Latitude", val: location.latitude || location.Latitude || "N/A" },
                  { label: "Longitude", val: location.longitude || location.Longitude || "N/A" },
                  { label: "Last Update", val: location.date_time ? new Date(location.date_time).toLocaleDateString() : "N/A" },
                ].map((item, i) => (
                  <Box key={i} sx={{ display: "flex", justifyContent: "space-between", py: 0.8 }}>
                    <Typography sx={{ fontSize: 12, color: isDark ? "#94a3b8" : "#64748b" }}>{item.label}</Typography>
                    <Typography sx={{ fontSize: 12, fontWeight: 600, color: isDark ? "#e2e8f0" : "#1e293b" }}>{item.val}</Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography sx={{ fontSize: 12, color: isDark ? "#475569" : "#94a3b8" }}>Loading...</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;

import { useState } from "react";
import {
  Box, Card, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Collapse, ButtonBase, Chip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CompareArrowsRoundedIcon from "@mui/icons-material/CompareArrowsRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import { categoryById } from "../data/categories";

function bestPrice(pkg) {
  if (pkg.priceByTerm) return Math.min(...Object.values(pkg.priceByTerm));
  return pkg.priceMonthly;
}

export default function ComparisonTable({ packages }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [open, setOpen] = useState(false);

  return (
    <Box sx={{ mt: 5 }}>
      <ButtonBase
        onClick={() => setOpen(!open)}
        sx={{
          width: "100%", justifyContent: "space-between", px: 2.5, py: 1.75, borderRadius: 3,
          bgcolor: isDark ? "rgba(255,255,255,0.03)" : "#fff",
          border: `1px solid ${isDark ? "rgba(148,163,184,0.12)" : "#e2e8f0"}`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
          <CompareArrowsRoundedIcon sx={{ color: "text.secondary" }} />
          <Typography sx={{ fontWeight: 700, fontSize: 14.5 }}>Compare all packages side-by-side</Typography>
        </Box>
        <ExpandMoreRoundedIcon sx={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.25s ease" }} />
      </ButtonBase>

      <Collapse in={open} timeout={300}>
        <Card sx={{ mt: 2, overflow: "hidden" }}>
          <TableContainer sx={{ overflowX: "auto" }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Package</TableCell>
                  <TableCell align="right">Speed</TableCell>
                  <TableCell align="right">Upload</TableCell>
                  <TableCell align="right">From / Month</TableCell>
                  <TableCell>Installation</TableCell>
                  <TableCell>Contract</TableCell>
                  <TableCell>Best For</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {packages.map((pkg) => {
                  const cat = categoryById[pkg.category];
                  const isBroadband = pkg.priceByTerm != null;
                  return (
                    <TableRow key={pkg.id} hover>
                      <TableCell sx={{ fontWeight: 700 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Box sx={{ width: 8, height: 8, borderRadius: "50%", background: cat.accent.gradient, flexShrink: 0 }} />
                          {pkg.name}
                          {pkg.statusBadge && (
                            <Chip label={pkg.statusBadge} size="small" sx={{ height: 18, fontSize: 9.5 }} />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell align="right">{isBroadband ? `${pkg.speedDown} Mbps` : pkg.data}</TableCell>
                      <TableCell align="right">{isBroadband ? (pkg.speedUp ? `${pkg.speedUp} Mbps` : "—") : "—"}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, color: isDark ? cat.accent.light : cat.accent.dark }}>
                        N${bestPrice(pkg).toFixed(2)}
                      </TableCell>
                      <TableCell sx={{ maxWidth: 180 }}>{pkg.installation}</TableCell>
                      <TableCell sx={{ maxWidth: 160 }}>{pkg.contract}</TableCell>
                      <TableCell sx={{ maxWidth: 220 }}>{pkg.recommendedFor?.slice(0, 2).join(", ")}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Collapse>
    </Box>
  );
}

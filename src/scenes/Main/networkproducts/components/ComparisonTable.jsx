import { useState } from "react";
import {
  Box, Card, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Collapse, ButtonBase, Chip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CompareArrowsRoundedIcon from "@mui/icons-material/CompareArrowsRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import { categoryById } from "../data/categories";

// Lowest published figure for the product, or null where Africa Online quotes
// on request. Never coerced to 0 — a 0 would read as "free" in the table.
function bestPrice(pkg) {
  if (pkg.priceByTerm) return Math.min(...Object.values(pkg.priceByTerm));
  return pkg.price ?? null;
}

const fmtPrice = (n) => n.toLocaleString("en-NA", { maximumFractionDigits: 2 });

export default function ComparisonTable({ packages }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [open, setOpen] = useState(false);

  return (
    <Box sx={{ mt: { xs: 4, sm: 5 } }}>
      <ButtonBase
        onClick={() => setOpen(!open)}
        sx={{
          width: "100%", justifyContent: "space-between", minHeight: 52,
          px: { xs: 2, sm: 2.5 }, py: 1.5, borderRadius: 3,
          bgcolor: isDark ? "rgba(255,255,255,0.03)" : "#fff",
          border: `1px solid ${isDark ? "rgba(148,163,184,0.12)" : "#e2e8f0"}`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
          <CompareArrowsRoundedIcon sx={{ color: "text.secondary" }} />
          <Typography sx={{ fontWeight: 700, fontSize: { xs: 13, sm: 14.5 } }}>
            <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>Compare all products side-by-side</Box>
            <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>Compare all products</Box>
          </Typography>
        </Box>
        <ExpandMoreRoundedIcon sx={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.25s ease" }} />
      </ButtonBase>

      <Collapse in={open} timeout={300}>
        <Card sx={{ mt: 2, overflow: "hidden" }}>
          <TableContainer sx={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            <Table size="small" sx={{ minWidth: 640 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell align="right">Headline</TableCell>
                  <TableCell align="right">From</TableCell>
                  <TableCell>Billing</TableCell>
                  <TableCell>Best For</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {packages.map((pkg) => {
                  const cat = categoryById[pkg.category];
                  const from = bestPrice(pkg);
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
                      <TableCell sx={{ maxWidth: 170 }}>{cat.shortLabel}</TableCell>
                      <TableCell align="right">{pkg.headline ?? "—"}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, color: isDark ? cat.accent.light : cat.accent.dark, whiteSpace: "nowrap" }}>
                        {from != null ? `N$${fmtPrice(from)}` : "On request"}
                      </TableCell>
                      <TableCell sx={{ maxWidth: 170 }}>
                        {from != null ? `${pkg.priceUnit}${pkg.exVat ? " ex VAT" : ""}` : "Quoted per proposal"}
                      </TableCell>
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

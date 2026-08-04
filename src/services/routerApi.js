// Reaches a GRIDx router's own on-device API (the same `protocol.csp`
// endpoint the router's stock admin UI uses) via two possible paths, tried
// in order — see gridx-router-console/docs/METER_RELAY_TUNNEL_EVALUATION.md
// for the full reasoning behind this design:
//
//   1. LOCAL — direct browser fetch to the router's private IP (default
//      192.168.8.1). Only succeeds when the browser itself is on the
//      router's own network — a technician on-site on its Wi-Fi. This is
//      the same mechanism gridx-router-console uses, minus its dev-server
//      proxy (this is a production static app, so CORS will block this path
//      in practice from client.gridx-meters.com — see the doc above. It's
//      kept as the first attempt anyway since it costs nothing to try and
//      *does* work for same-network/local-serving scenarios).
//   2. TUNNEL — relay through GRIDx's existing backend → meter → router
//      path, for when the Portal is used off-site. NOT YET IMPLEMENTED
//      server-side — the endpoint this calls does not exist yet on the
//      backend or meter firmware (see the evaluation doc for why those two
//      legs weren't built in this session). Calling it will 404/fail until
//      that work is done; this file is written against the contract that
//      work should implement, not a guess.
//
// If neither path works, callers fall back to MOCK_SNAPSHOT — this file
// never fabricates a "connected" state.
//
// Read-only by design: every request uses function=get, on both paths. No
// write (function=set) is ever made here — configuring the router remotely
// is future work (see gridx-router-console's ISP Remote Management
// architecture doc), not something this integration does today.

import { API_BASE } from "./api";

const HOST_STORAGE_KEY = "gridx_router_host";
const DEFAULT_HOST = "192.168.8.1";

export function getRouterHost() {
  return localStorage.getItem(HOST_STORAGE_KEY) || DEFAULT_HOST;
}

export function setRouterHost(host) {
  localStorage.setItem(HOST_STORAGE_KEY, host.trim() || DEFAULT_HOST);
}

async function cspGet(fname, opt, timeoutMs = 4000) {
  const host = getRouterHost();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const body = new URLSearchParams({ fname, opt, function: "get", math: String(Math.random()) });
    const res = await fetch(`http://${host}/protocol.csp?`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * True if the router at the configured host is actually reachable from this
 * browser right now. Fails fast (network error, CORS block, mixed-content
 * block, or timeout all land here) rather than hanging the UI.
 */
export async function checkRouterReachable() {
  try {
    await cspGet("system", "main", 2500);
    return true;
  } catch {
    return false;
  }
}

// The exact set of (fname, opt) reads this feature needs — used as an
// allowlist on the tunnel path so the backend/meter relay contract has a
// concrete, auditable surface rather than "forward anything." A future
// backend/meter implementation of the tunnel should enforce this same list
// server-side too — this array being the client's intent doesn't make it
// trustworthy on its own; the relay must not just take the client's word for
// what's safe to forward.
export const ROUTER_RELAY_ALLOWLIST = [
  { fname: "system", opt: "main" },
  { fname: "system", opt: "host_list" },
  { fname: "net", opt: "lan_conf" },
  { fname: "net", opt: "wifi_advance" },
  { fname: "net", opt: "g4_conf" },
  { fname: "net", opt: "webrm_conf" },
];

/**
 * Relays a single read through the backend → meter → router path (see the
 * module header). This endpoint does not exist on the backend yet — this is
 * the contract it should implement:
 *
 *   POST {API_BASE}/router-relay/{drn}
 *   body: { fname, opt }               — must be one of ROUTER_RELAY_ALLOWLIST
 *   auth: same Bearer token as every other services/api.js call
 *   response: the router's own protocol.csp JSON, unmodified
 *
 * Until that exists, this throws — callers must treat tunnel failure the
 * same as local failure (fall back to demo data), not as a special error.
 */
async function cspGetViaTunnel(drn, fname, opt, timeoutMs = 8000) {
  if (!ROUTER_RELAY_ALLOWLIST.some((e) => e.fname === fname && e.opt === opt)) {
    throw new Error(`${fname}/${opt} is not in ROUTER_RELAY_ALLOWLIST`);
  }
  const token = sessionStorage.getItem("Token");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${API_BASE}/router-relay/${drn}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ fname, opt }),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * True if the tunnel path is currently usable for this meter. Will return
 * false until the backend endpoint above is implemented — that's expected,
 * not a bug in this check.
 */
export async function checkTunnelAvailable(drn) {
  if (!drn) return false;
  try {
    await cspGetViaTunnel(drn, "system", "main", 4000);
    return true;
  } catch {
    return false;
  }
}

function parseUptime(s) {
  const h = /(\d+)\s*hour/.exec(s || "");
  const m = /(\d+)\s*min/.exec(s || "");
  const sec = /(\d+)\s*sec/.exec(s || "");
  return (h ? Number(h[1]) * 3600 : 0) + (m ? Number(m[1]) * 60 : 0) + (sec ? Number(sec[1]) : 0);
}

function assembleSnapshot(source, { main, hostList, lanConf, wifiAdvance, g4Conf, webrmConf }) {
  return {
    live: true,
    source, // "local" | "tunnel" — which path this data actually came from
    system: {
      hardwareVersion: main.hardversion,
      softwareVersion: main.fmversion,
      uptimeSeconds: parseUptime(main.uptime),
      workMode: main.newworkmode === "g4" ? "Cellular (4G/5G)" : main.newworkmode,
    },
    cellular: {
      moduleModel: main.modulefmver,
      networkMode: main.nwmode,
      band: main.celluband,
      carrier: `MCC ${main.mcc} / MNC ${main.mnc}`,
      simStatus: main.sim === 1 ? "normal" : "error",
      rsrp: Number(main.rsrp),
      rsrq: Number(main.rsrq),
      rssi: Number(main.rssi),
      sinr: Number(main.sinr),
      apn: g4Conf.apn,
    },
    wifi: {
      ssid2g: wifiAdvance.ssid2g || main.ssid,
      ssid5g: wifiAdvance.ssid5g?.trim() || null,
      clientCount: hostList.hostnum ?? 0,
    },
    network: {
      lanIp: lanConf.ip,
      dhcpEnabled: lanConf.server === 1,
      leaseCount: hostList.hostnum ?? 0,
    },
    security: {
      remoteManagementEnabled: webrmConf.enable === 1,
      remoteManagementPort: webrmConf.enable === 1 ? Number(webrmConf.port) : null,
      unauthenticatedReadApi: true,
    },
    clients: (hostList.hostlist || []).map((h, i) => ({
      id: `${h.mac}-${i}`,
      ip: h.ip,
      mac: (h.mac || "").toUpperCase(),
      wireless: h.type === 1,
      rssi: h.rssi ? Number(h.rssi) : null,
    })),
  };
}

/** Local path: direct browser fetch to the router's own IP. */
async function getSnapshotLocal() {
  const [main, hostList, lanConf, wifiAdvance, g4Conf, webrmConf] = await Promise.all([
    cspGet("system", "main"),
    cspGet("system", "host_list"),
    cspGet("net", "lan_conf"),
    cspGet("net", "wifi_advance"),
    cspGet("net", "g4_conf"),
    cspGet("net", "webrm_conf"),
  ]);
  return assembleSnapshot("local", { main, hostList, lanConf, wifiAdvance, g4Conf, webrmConf });
}

/** Tunnel path: relayed through the backend → meter → router (see module header). */
async function getSnapshotViaTunnel(drn) {
  const [main, hostList, lanConf, wifiAdvance, g4Conf, webrmConf] = await Promise.all([
    cspGetViaTunnel(drn, "system", "main"),
    cspGetViaTunnel(drn, "system", "host_list"),
    cspGetViaTunnel(drn, "net", "lan_conf"),
    cspGetViaTunnel(drn, "net", "wifi_advance"),
    cspGetViaTunnel(drn, "net", "g4_conf"),
    cspGetViaTunnel(drn, "net", "webrm_conf"),
  ]);
  return assembleSnapshot("tunnel", { main, hostList, lanConf, wifiAdvance, g4Conf, webrmConf });
}

/**
 * The single entry point pages should use: tries local first (works when the
 * browser is physically on the router's network), falls back to the tunnel
 * (works anywhere, once the backend/meter legs described in
 * METER_RELAY_TUNNEL_EVALUATION.md exist), and falls back to clearly-labeled
 * demo data if neither works. Never throws — always resolves to a usable
 * snapshot with `.live` and `.source` telling the caller which one it got.
 */
export async function getRouterSnapshot(drn) {
  try {
    return await getSnapshotLocal();
  } catch {
    // not on the router's LAN, or CORS blocked it — try the tunnel next
  }
  if (drn) {
    try {
      return await getSnapshotViaTunnel(drn);
    } catch {
      // tunnel not implemented yet, or this meter isn't relay-capable — fall through
    }
  }
  return MOCK_SNAPSHOT;
}

// Grounded in a real reading taken from the actual target device this
// session — shown whenever the router isn't reachable from the current
// browser (i.e. almost always, for a customer browsing from off-site).
export const MOCK_SNAPSHOT = {
  live: false,
  source: "demo",
  system: {
    hardwareVersion: "ZJWL-P2-hv10",
    softwareVersion: "ZJWL-p2-v33",
    uptimeSeconds: 76715,
    workMode: "Cellular (4G/5G)",
  },
  cellular: {
    moduleModel: "EC200AEUHAR01A21M16",
    networkMode: "4G",
    band: "FDD LTE BAND 3",
    carrier: "MCC 649 / MNC 01 (MTC, Namibia)",
    simStatus: "normal",
    rsrp: -77, rsrq: -11, rssi: -65, sinr: 6,
    apn: "internet",
  },
  wifi: { ssid2g: "GRIDx35803", ssid5g: null, clientCount: 4 },
  network: { lanIp: "192.168.8.1", dhcpEnabled: true, leaseCount: 4 },
  security: { remoteManagementEnabled: true, remoteManagementPort: 8080, unauthenticatedReadApi: true },
  clients: [
    { id: "1", ip: "192.168.8.170", mac: "BE:6C:79:38:08:95", wireless: true, rssi: -55 },
    { id: "2", ip: "192.168.8.143", mac: "C6:35:8C:B8:F7:1B", wireless: true, rssi: -57 },
    { id: "3", ip: "192.168.8.244", mac: "98:43:FA:2A:7C:4F", wireless: true, rssi: -49 },
    { id: "4", ip: "192.168.8.221", mac: "B0:DC:EF:16:4C:16", wireless: true, rssi: -59 },
  ],
};

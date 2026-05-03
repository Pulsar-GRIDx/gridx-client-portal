const API_BASE = "https://gridx-meters.com/cb";

function getHeaders() {
  const token = sessionStorage.getItem("Token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request(url, options = {}) {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: getHeaders(),
    ...options,
  });
  if (res.status === 401 || res.status === 403) {
    sessionStorage.removeItem("Token");
    sessionStorage.removeItem("user");
    throw new Error("Session expired");
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || body.message || `Request failed (${res.status})`);
  }
  return res.json();
}

function get(url) { return request(url); }
function post(url, body) { return request(url, { method: "POST", body: JSON.stringify(body) }); }
function put(url, body) { return request(url, { method: "PUT", body: JSON.stringify(body) }); }

export const customerAuthAPI = {
  signin: (Email, Password, DRN) => post("/customer/signin", { Email, Password, DRN }),
  signup: (data) => post("/customer/signup", data),
  forgotPassword: (Email) => post("/customer/forgot-password", { Email }),
  verifyPin: (Email, pin) => post("/customer/verify-pin", { Email, pin }),
  resetPassword: (Email, pin, Password, newPassword) =>
    post("/customer/reset-password", { Email, pin, Password, newPassword }),
  requestMeterValidation: (DRN, type) => post("/customer/request-meter-validation", { DRN, type }),
  checkMeterValidation: (drn) => get(`/customer/check-meter-validation/${drn}`),
};

export const meterDataAPI = {
  getPower: (drn) => get(`/meterPower/getLastUpdate/${drn}`),
  getEnergy: (drn) => get(`/meterEnergy/getLastUpdate/${drn}`),
  getLoadControl: (drn) => get(`/meterLoadControl/getLastUpdate/${drn}`),
  getMainsState: (drn) => get(`/meterMainsState/getLastUpdate/${drn}`),
  getHeaterState: (drn) => get(`/meterHeaterState/getLastUpdate/${drn}`),
  getMainsControl: (drn) => get(`/meterMainsControl/getLastUpdate/${drn}`),
  getHeaterControl: (drn) => get(`/meterHeaterControl/getLastUpdate/${drn}`),
  getWeekMonthData: (drn) => get(`/meterWeekAndMonthData/${drn}`),
  getStsTokens: (drn) => get(`/stsTokensByDRN/${drn}`),
  getLocation: (drn) => get(`/meterLocation/${drn}`),
  getHourlyData: (drn) => get(`/getHourlyDataByDrn/${drn}`),
  getDailyPower: (drn) => get(`/meterDailyPower/${drn}`),
  getNotifications: (drn) => get(`/notificationsByDRN/${drn}`),
  getProfileByDRN: (drn) => get(`/meterDataByDRN/${drn}`),
  getCellNetwork: (drn) => get(`/meterCellNetwork/getLastUpdate/${drn}`),
  getTokenInfo: (drn) => get(`/settings/tokenInformation/${drn}`),
};

export const meterControlAPI = {
  setMainsControl: (drn, state, reason) =>
    post(`/meterMainsControl/update/${drn}`, { state, processed: 0, reason: reason || "Customer Portal" }),
  setHeaterControl: (drn, state, reason) =>
    post(`/meterHeaterControl/update/${drn}`, { state, processed: 0, reason: reason || "Customer Portal" }),
  setMainsState: (drn, state, reason) =>
    post(`/meterMainsState/update/${drn}`, { state, processed: 0, reason: reason || "Customer Portal" }),
  setHeaterState: (drn, state, reason) =>
    post(`/meterHeaterState/update/${drn}`, { state, processed: 0, reason: reason || "Customer Portal" }),
  sendToken: (drn, tokenId) =>
    post(`/meterSendSTSToken/update/${drn}`, { token_ID: tokenId, processed: 0 }),
};

export const energyDataAPI = {
  getTimePeriods: () => get("/energy-time-periods"),
  getCurrentDay: () => get("/currentDayEnergy"),
  getWeekly: () => get("/weekly/currentAndLastWeekEnergyTotal"),
  getMonthlyYearly: () => get("/yearly/currentAndLastYearMonthEnergyTotal"),
  getHourlyPower: () => get("/hourlyPowerConsumption"),
  getPowerIncreaseOrDecrease: () => get("/powerIncreaseOrDecrease"),
  getHourlyByDrn: (drn) => get(`/getHourlyDataByDrn/${drn}`),
};

export const vendingAPI = {
  getTariffInfo: (drn) => get(`/vending/tariff-info/${drn}`),
  getDSMConfig: (drn) => get(`/vending/dsm/${drn}`),
  getTransactions: (params) => {
    const q = new URLSearchParams(params).toString();
    return get(`/vending/transactions${q ? '?' + q : ''}`);
  },
};

export const netMeteringAPI = {
  getLatest: (drn) => get(`/mqtt/net-energy/${drn}`),
  getSummary: (drn) => get(`/mqtt/net-energy/${drn}/summary`),
  getHistory: (drn, limit = 30) => get(`/mqtt/net-energy/${drn}/history?limit=${limit}`),
};

export const mqttAPI = {
  sendToken: (drn, token) => post(`/mqtt/command/${drn}`, { command: "send_token", token }),
  creditTransfer: (drn, data) => post(`/mqtt/credit-transfer/${drn}`, data),
  getTransferStatus: (drn, id) => get(`/mqtt/credit-transfer/${drn}/status/${id}`),
};

export const meterHealthAPI = {
  getLatest: (drn) => get(`/mqtt/meter-health/${drn}`),
  getHistory: (drn, limit = 72) => get(`/mqtt/meter-health/${drn}/history?limit=${limit}`),
};

export default { auth: customerAuthAPI, meter: meterDataAPI, control: meterControlAPI, energy: energyDataAPI, vending: vendingAPI, netMetering: netMeteringAPI, mqtt: mqttAPI, health: meterHealthAPI, API_BASE };

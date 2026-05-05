import React, { useState, useEffect, createContext, useContext } from "react";
import AuthContext from "../../../context/AuthContext";
import { meterDataAPI, energyDataAPI } from "../../../services/api";

const DataContext = createContext();

export const useData = () => {
  return useContext(DataContext);
};

const DataProvider = ({ children }) => {
  const { user, userInfo } = useContext(AuthContext);
  const [unitsData, setUnitsData] = useState("");
  const [averageUnitsData, setAverageUnitsData] = useState("");
  const [allData, setAllData] = useState([]);
  const [hourlyData, setHourlyData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [grandTotal, setGrandTotal] = useState("");
  const [averageSystemLoad, setAverageSystemLoad] = useState("");
  const [currentDayEnergy, setCurrentDayEnergy] = useState("");
  const [timeperiodsEnergy, setTimeperiodsEnergy] = useState({
    day: 0,
    month: 0,
    year: 0,
  });
  const [percentageEnergy, setPercentageEnergy] = useState({
    day: 0,
    month: 0,
    year: 0,
  });
  const [chartSeriesWeekly, setChartSeriesWeekly] = useState({
    lastweek: [],
    currentweek: [],
  });
  const [chartSeriesYearly, setChartSeriesYearly] = useState({
    Last: [],
    Current: [],
  });
  const [powerData, setPowerData] = useState({
    voltage: "",
    current: "",
    frequency: "",
    active_energy: "",
    power: "",
  });
  const [userData, setUserData] = useState({
    UserID: "",
    FirstName: "",
    LastName: "",
    DRN: "",
    Email: "",
    streetName: "",
    cityName: "",
    countryName: "",
  });
  const [loadData, setLoadData] = useState({
    mains_state: 0,
    geyser_state: 0,
  });
  const [signalStrengthData, setSignalStrengthData] = useState("");

  const getDRN = () => {
    if (userInfo && userInfo.DRN) return userInfo.DRN;
    const saved = sessionStorage.getItem("user");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.DRN;
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  const fetchMeterPower = async () => {
    const drn = getDRN();
    if (!drn) return;
    try {
      const [powerResp, energyResp] = await Promise.allSettled([
        meterDataAPI.getPower(drn),
        meterDataAPI.getEnergy(drn),
      ]);

      const pData = powerResp.status === "fulfilled" ? powerResp.value : null;
      const eData = energyResp.status === "fulfilled" ? energyResp.value : null;

      if (pData) {
        setPowerData({
          voltage: pData.voltage || 0,
          current: pData.current || 0,
          frequency: pData.frequency || 0,
          active_energy: pData.active_power || pData.active_energy || 0,
          power: pData.active_power || 0,
        });
        setSignalStrengthData(pData.signal_strength || 0);
      }

      if (eData) {
        setUnitsData(parseFloat(eData.units || eData.active_energy || 0).toFixed(1));
        setAverageUnitsData(eData.units_used_today || 0);
      } else if (pData) {
        setUnitsData(parseFloat(pData.active_energy || pData.units || 0).toFixed(1));
        setAverageUnitsData(pData.units_used_today || 0);
      }
    } catch (error) {
      console.error("Error fetching meter power:", error);
    }
  };

  const fetchHourlyEnergy = async () => {
    const drn = getDRN();
    if (!drn) return;
    try {
      const resp = await meterDataAPI.getHourlyData(drn);
      const arr = resp?.data || resp?.sums || [];
      setAllData(arr);
      setHourlyData(arr);
      const total = arr.reduce((s, h) => s + (parseFloat(h.kWh) || 0), 0);
      setAverageSystemLoad(total > 0 ? (total / arr.filter(h => (parseFloat(h.kWh) || 0) > 0).length || 1).toFixed(2) : 0);
    } catch (error) {
      console.error("Error fetching hourly energy:", error);
    }
  };

  const fetchUserData = async () => {
    const saved = sessionStorage.getItem("user");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUserData({
          UserID: parsed.UserID || "",
          FirstName: parsed.FirstName || "",
          LastName: parsed.LastName || "",
          DRN: parsed.DRN || "",
          Email: parsed.Email || "",
          streetName: "",
          cityName: "",
          countryName: "",
        });
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }
  };

  const fetchCurrentDayEnergy = async () => {
    try {
      const data = await energyDataAPI.getCurrentDay();
      if (data) {
        setCurrentDayEnergy(data);
        setGrandTotal(data);
      }
    } catch (error) {}
  };

  const fetchMonthlyEnergy = async () => {
    try {
      const data = await energyDataAPI.getMonthlyYearly();
      if (data) {
        setChartSeriesYearly({ Last: data.Last || [], Current: data.Current || [] });
      }
    } catch (error) {}
  };

  const fetchWeeklyEnergy = async () => {
    try {
      const data = await energyDataAPI.getWeekly();
      if (data) {
        setChartSeriesWeekly({
          lastweek: data.lastweek || [],
          currentweek: data.currentweek || [],
        });
      }
    } catch (error) {}
  };

  const fetchTimePeriods = async () => {
    try {
      const data = await energyDataAPI.getTimePeriods();
      if (data) {
        setTimeperiodsEnergy({
          day: data.day || 0,
          month: data.month || 0,
          year: data.year || 0,
        });
      }
    } catch (error) {}
  };

  const fetchPercentageChange = async () => {
    try {
      const data = await energyDataAPI.getPowerIncreaseOrDecrease();
      if (data) {
        setPercentageEnergy({
          day: data.dayPercentage || 0,
          month: data.monthPercentage || 0,
          year: data.yearPercentage || 0,
        });
      }
    } catch (error) {}
  };

  useEffect(() => {
    let isMounted = true;
    if (user) {
      const fetchLoadStates = async () => {
        const drn = getDRN();
        if (!drn) return;
        try {
          const [heaterResp, mainsResp] = await Promise.allSettled([
            meterDataAPI.getHeaterState(drn),
            meterDataAPI.getMainsState(drn),
          ]);
          if (isMounted) {
            const hData = heaterResp.status === "fulfilled" ? heaterResp.value : {};
            const mData = mainsResp.status === "fulfilled" ? mainsResp.value : {};
            setLoadData({
              geyser_state: hData?.state || hData?.heater_state || 0,
              mains_state: mData?.state || mData?.mains_state || 0,
            });
          }
        } catch (error) {
          console.error("Fetch load states error:", error);
        }
      };
      fetchLoadStates();
      return () => { isMounted = false; };
    }
  }, [user, userInfo]);

  useEffect(() => {
    if (user) {
      const fetchAll = () => {
        fetchMeterPower();
        fetchHourlyEnergy();
        fetchUserData();
        fetchCurrentDayEnergy();
        fetchMonthlyEnergy();
        fetchWeeklyEnergy();
        fetchTimePeriods();
        fetchPercentageChange();
      };
      fetchAll();
      const intervalId = setInterval(fetchAll, 60000);
      return () => clearInterval(intervalId);
    }
  }, [user, userInfo]);

  const data = {
    unitsData,
    averageUnitsData,
    powerData,
    signalStrengthData,
    allData,
    hourlyData,
    startDate,
    grandTotal,
    averageSystemLoad,
    userData,
    loadData,
    currentDayEnergy,
    chartSeriesWeekly,
    chartSeriesYearly,
    timeperiodsEnergy,
    percentageEnergy,
  };

  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
};

export default DataProvider;

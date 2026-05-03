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
      const data = await meterDataAPI.getPower(drn);
      if (data && data !== 0) {
        setUnitsData(data.units || data.active_energy || 0);
        setAverageUnitsData(data.units_used_today || 0);
        setPowerData({
          voltage: data.voltage || 0,
          current: data.current || 0,
          frequency: data.frequency || 0,
          active_energy: data.active_energy || 0,
        });
        setSignalStrengthData(data.signal_strength || 0);
      } else {
        setUnitsData(0);
        setAverageUnitsData(0);
        setPowerData({ voltage: 0, current: 0, frequency: 0, active_energy: 0 });
        setSignalStrengthData(0);
      }
    } catch (error) {
      console.error("Error fetching meter power:", error);
    }
  };

  const fetchHourlyEnergy = async () => {
    const drn = getDRN();
    if (!drn) return;
    try {
      const data = await meterDataAPI.getHourlyData(drn);
      if (data) {
        setAllData(data.sums || data.data || []);
        setAverageSystemLoad(data.averageUsage || 0);
      }
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
    } catch (error) {
      console.error("Error fetching current day energy:", error);
    }
  };

  const fetchMonthlyEnergy = async () => {
    try {
      const data = await energyDataAPI.getMonthlyYearly();
      if (data) {
        setChartSeriesYearly({ Last: data.Last || [], Current: data.Current || [] });
      }
    } catch (error) {
      console.error("Error fetching monthly energy:", error);
    }
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
    } catch (error) {
      console.error("Error fetching weekly energy:", error);
    }
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
    } catch (error) {
      console.error("Error fetching time periods:", error);
    }
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
    } catch (error) {
      console.error("Error fetching percentage data:", error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (user) {
      const fetchLoadStates = async () => {
        const drn = getDRN();
        if (!drn) return;
        try {
          const [heaterData, mainsData] = await Promise.allSettled([
            meterDataAPI.getHeaterState(drn),
            meterDataAPI.getMainsState(drn),
          ]);
          if (isMounted) {
            setLoadData({
              geyser_state: heaterData.status === "fulfilled" ? heaterData.value : 0,
              mains_state: mainsData.status === "fulfilled" ? mainsData.value : 0,
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
      const intervalId = setInterval(fetchAll, 600000);
      return () => clearInterval(intervalId);
    }
  }, [user, userInfo]);

  const data = {
    unitsData,
    averageUnitsData,
    powerData,
    signalStrengthData,
    allData,
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

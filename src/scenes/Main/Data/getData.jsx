import React, { useState, useEffect, createContext, useContext } from "react";
import AuthContext from "../../../context/AuthContext";

const MeterAPI = "https://backend1.gridxmeter.com/meterPower";
const EnergyAPI = "https://backend1.gridxmeter.com/hourlyEnergyByDRN";
const ProfileAPI = "https://backend1.gridxmeter.com/userData";
const CurrentAPI = "https://backend1.gridxmeter.com/currentDayEnergy";
const MonthPowerAPI = "https://backend1.gridxmeter.com/monthlyEnergyByDRN";
const WeekPowerAPI = "https://backend1.gridxmeter.com/weeklyTotalEnergyByDRN";
const TimePeriodsPowerAPI =
  "https://backend1.gridxmeter.com/energyTimePeriodsByDRN";
const TimePeriodsPercentagePowerAPI =
  "https://backend1.gridxmeter.com/meterPowerIncreaseOrDecrease";

const DataContext = createContext();

/**
 * @module Contexts
 */

/**
 * Custom hook to use DataContext.
 * @returns {Object} The data context value.
 */
export const useData = () => {
  return useContext(DataContext);
};

/**
 * DataProvider component to fetch and provide energy and user data.
 * @component
 * @param {Object} props - Component properties.
 * @param {ReactNode} props.children - Children components.
 * @returns {ReactNode} The DataContext provider with data values.
 */
const DataProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
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
    mains_state: 0, // "0" for OFF, "1" for ON
    geyser_state: 0, // "0" for OFF, "1" for ON
  });

  const [signalStrengthData, setSignalStrengthData] = useState("");

  /**
   * Retrieve access token from session storage.
   * @returns {string} Access token.
   */
  const getAccessToken = () => {
    return sessionStorage.getItem("Token");
  };

  /**
   * Fetch meter power data.
   */
  const fetchData = async () => {
    try {
      const meterResponse = await fetch(MeterAPI, {
        headers: {
          authorization: `${getAccessToken()}`,
          "Content-Type": "application/json",
        },
      });
      const meterJson = await meterResponse.json();
      if (meterJson !== 0) {
        setUnitsData(meterJson.units);
        setAverageUnitsData(meterJson.units_used_today);
        setPowerData({
          voltage: meterJson.voltage,
          current: meterJson.current,
          frequency: meterJson.frequency,
          active_energy: meterJson.active_energy,
        });
        setSignalStrengthData(meterJson.signal_strength);
      } else {
        setUnitsData(0);
        setAverageUnitsData(0);
        setPowerData({
          voltage: 0,
          current: 0,
          frequency: 0,
          active_energy: 0,
        });
        setSignalStrengthData(0);
      }
    } catch (error) {
      console.error("Error fetching meter data:", error);
    }
  };

  /**
   * Fetch hourly energy data.
   */
  const fetchData2 = async () => {
    try {
      const energyResponse = await fetch(EnergyAPI, {
        headers: {
          authorization: `${getAccessToken()}`,
          "Content-Type": "application/json",
        },
      });
      const energyJson = await energyResponse.json();
      setAllData(energyJson.sums);
      setAverageSystemLoad(energyJson.averageUsage);
    } catch (error) {
      console.error("Error fetching energy data:", error);
    }
  };

  /**
   * Fetch user profile data.
   */
  const fetchData3 = async () => {
    try {
      const response = await fetch(ProfileAPI, {
        method: "GET",
        headers: {
          authorization: `${getAccessToken()}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      } else {
        console.error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  /**
   * Fetch current day energy data.
   */
  const fetchData4 = async () => {
    try {
      const response = await fetch(CurrentAPI, {
        method: "GET",
        headers: {
          authorization: `${getAccessToken()}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setCurrentDayEnergy(data);
        setGrandTotal(data);
      } else {
        console.error("Failed to fetch current day energy data");
      }
    } catch (error) {
      console.error("Error fetching current day energy data:", error);
    }
  };

  /**
   * Fetch monthly energy data.
   */
  const fetchData6 = async () => {
    try {
      const response = await fetch(MonthPowerAPI, {
        method: "GET",
        headers: {
          authorization: `${getAccessToken()}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setChartSeriesYearly({ Last: data.Last, Current: data.Current });
      } else {
        console.error("Failed to fetch monthly energy data");
      }
    } catch (error) {
      console.error("Error fetching monthly energy data:", error);
    }
  };

  /**
   * Fetch energy percentage increase or decrease.
   */
  const fetchData8 = async () => {
    try {
      const response = await fetch(TimePeriodsPercentagePowerAPI, {
        method: "GET",
        headers: {
          authorization: `${getAccessToken()}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setPercentageEnergy({
          day: data.dayPercentage,
          month: data.monthPercentage,
          year: data.yearPercentage,
        });
      } else {
        console.error("Failed to fetch energy percentage data");
      }
    } catch (error) {
      console.error("Error fetching energy percentage data:", error);
    }
  };

  /**
   * Fetch energy data for different time periods.
   */
  const fetchData9 = async () => {
    try {
      const response = await fetch(TimePeriodsPowerAPI, {
        method: "GET",
        headers: {
          authorization: `${getAccessToken()}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setTimeperiodsEnergy({
          day: data.day,
          month: data.month,
          year: data.year,
        });
      } else {
        console.error("Failed to fetch energy data for different time periods");
      }
    } catch (error) {
      console.error("Error fetching energy data for different time periods:", error);
    }
  };

  /**
   * Fetch weekly total energy data.
   */
  const fetchData7 = async () => {
    try {
      const response = await fetch(WeekPowerAPI, {
        method: "GET",
        headers: {
          authorization: `${getAccessToken()}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setChartSeriesWeekly({
          lastweek: data.lastweek,
          currentweek: data.currentweek,
        });
      } else {
        console.error("Failed to fetch weekly total energy data");
      }
    } catch (error) {
      console.error("Error fetching weekly total energy data:", error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (user) {
      /**
       * Fetch heater and meter states.
       */
      const fetchData5 = async () => {
        try {
          const heaterResponse = await fetch(
            `https://backend1.gridxmeter.com/get-heater-state`,
            {
              method: "GET",
              headers: {
                authorization: `${getAccessToken()}`,
                "Content-Type": "application/json",
              },
            }
          );
          const meterResponse = await fetch(
            `https://backend1.gridxmeter.com/get-meter-state`,
            {
              method: "GET",
              headers: {
                authorization: `${getAccessToken()}`,
                "Content-Type": "application/json",
              },
            }
          );

          const heaterState = await heaterResponse.json();
          const meterState = await meterResponse.json();

          if (isMounted) {
            setLoadData((prevData) => ({
              ...prevData,
              geyser_state: heaterState,
              mains_state: meterState,
            }));
          }
        } catch (error) {
          console.error("Fetch data error:", error);
        }
      };

      fetchData5();

      return () => {
        isMounted = false; // Cleanup function to handle unmounting
      };
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchData();
      fetchData2();
      fetchData3();
      fetchData4();
      fetchData6();
      fetchData7();
      fetchData8();
      fetchData9();

      const intervalId = setInterval(() => {
        fetchData();
        fetchData2();
        fetchData3();
        fetchData4();
        fetchData6();
        fetchData7();
        fetchData8();
        fetchData9();
      }, 600000);
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [user]);

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

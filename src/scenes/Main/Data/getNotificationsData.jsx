import React, { useState, useEffect, createContext, useContext } from "react";
import AuthContext from "../../../context/AuthContext";
import { meterDataAPI } from "../../../services/api";

const NotificationDataContext = createContext();

export const useNotificationData = () => {
  return useContext(NotificationDataContext);
};

const NotificationDataProvider = ({ children }) => {
  const { user, userInfo } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);

  const getDRN = () => {
    if (userInfo && userInfo.DRN) return userInfo.DRN;
    const saved = sessionStorage.getItem("user");
    if (saved) {
      try {
        return JSON.parse(saved).DRN;
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  useEffect(() => {
    if (user) {
      const fetchNotifications = async () => {
        const drn = getDRN();
        if (!drn) return;
        try {
          const data = await meterDataAPI.getNotifications(drn);
          if (Array.isArray(data)) {
            setNotifications(data);
          }
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      };

      fetchNotifications();
      const intervalId = setInterval(fetchNotifications, 300000);
      return () => clearInterval(intervalId);
    }
  }, [user, userInfo]);

  const data = { notifications };

  return (
    <NotificationDataContext.Provider value={data}>
      {children}
    </NotificationDataContext.Provider>
  );
};

export default NotificationDataProvider;

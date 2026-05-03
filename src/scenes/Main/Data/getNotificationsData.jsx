import React, { useState, useEffect, createContext, useContext } from "react";
import io from "socket.io-client";
import AuthContext from "../../../context/AuthContext";

/**
 * @module Contexts
 */

const socket = io("https://backend1.gridxmeter.com", {
  query: {
    token: sessionStorage.getItem("Token"),
  },
});

const NotificationDataContext = createContext();

/**
 * Custom hook to access notification data context.
 * @returns {Object} The notification data context value.
 */
export const useNotificationData = () => {
  return useContext(NotificationDataContext);
};

/**
 * Provider component for notification data context.
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to be wrapped by the provider.
 * @returns {JSX.Element} The provider component for notification data.
 */
const NotificationDataProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [isNotificationPermissionGranted, setIsNotificationPermissionGranted] =
    useState(null);
  const [notifications, setNotifications] = useState([]);

  /**
   * Retrieves the access token from session storage.
   * @returns {string|null} The access token.
   */
  const getAccessToken = () => {
    return sessionStorage.getItem("Token");
  };

  useEffect(() => {
    if (user) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          setIsNotificationPermissionGranted(true);
          if ("serviceWorker" in navigator && "PushManager" in window) {
            navigator.serviceWorker.register("/sw.js").then((swReg) => {
              swReg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey:
                  "BEvPKm3dk1F8g5jc6jrwpGprV8rHkHHLDhm23W4qCD7tZEIr95-RouwUt0o28IidG-_QS2qIVlNXpsiY0TMk9vs",
              }).then((subscription) => {
                fetch("https://backend1.gridxmeter.com/subscribe", {
                  method: "POST",
                  body: JSON.stringify(subscription),
                  headers: {
                    authorization: `${getAccessToken()}`,
                    "content-type": "application/json",
                  },
                });
              });
            }).catch((error) => console.error("Service Worker Error", error));
          }
        } else {
          setIsNotificationPermissionGranted(false);
        }
      });
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      socket.on("connect", () => {
        const token = getAccessToken();
        socket.emit("authenticate", { token });
        socket.on("authenticated", (response) => {
          if (response.ok) {
            // Authentication successful
          } else {
            console.log("Failed to authenticate with server");
          }
        });
        socket.on("notifications", (data) => {
          setNotifications(data);
        });
      });

      socket.on("notifications", (data) => {
        setNotifications(data);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [user]);

  const data = {
    notifications,
  };

  return (
    <NotificationDataContext.Provider value={data}>
      {children}
    </NotificationDataContext.Provider>
  );
};

export default NotificationDataProvider;

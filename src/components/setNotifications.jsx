import React, { useState } from "react";

const SetNotifications = async (Notification, Type, Urgency, apiUrl) => {
  const [notificationData, setNotificationData] = useState({
    Alarm: Notification,
    AlarmType: Type,
    Urgency_type: Urgency,
  });

  const getAccessToken = () => {
    const token = sessionStorage.getItem("Token");
    return token;
  };

  let response; // Declare response outside the try-catch block

  try {
    response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        authorization: `${getAccessToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(notificationData),
    });

    if (response.ok) {
      console.log(notificationData);
      // Optionally, you can perform actions after setting the notification here
    } else {
      console.error("Failed to set notification:", response.statusText);
      // Optionally, you can handle the error here
    }
  } catch (error) {
    console.error("Error setting notification:", error.message);
    // Optionally, you can handle the error here
  }

  return response; // Now ESLint won't complain about 'response' being undefined
};

export default SetNotifications;

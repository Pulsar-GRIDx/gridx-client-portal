import React, { useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import { customerAuthAPI } from "../services/api";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [ApiErrMsg, setApiErrMsg] = useState(null);

  const apiCallLogin = async (data) => {
    try {
      setApiErrMsg(null);
      const email = data.Email || data.email;
      const password = data.Password || data.password;
      const drn = data.DRN || data.drn;
      const response = await customerAuthAPI.signin(email, password, drn);
      const token = response.token;
      const userData = response.user;
      sessionStorage.setItem("Token", token);
      sessionStorage.setItem("user", JSON.stringify(userData));
      window.location.reload();
      return;
    } catch (err) {
      if (err.message.includes("Failed to fetch")) {
        setApiErrMsg("No Server Response");
      } else if (err.message.includes("locked")) {
        setApiErrMsg("Account locked. Try again in 15 minutes.");
      } else if (err.message.includes("not found")) {
        setApiErrMsg("Email not found");
      } else if (err.message.includes("Invalid") || err.message.includes("password")) {
        setApiErrMsg("Invalid email or password");
      } else {
        setApiErrMsg(err.message || "Login Failed");
      }
    }
  };

  const apiCallRegister = async (data) => {
    try {
      setApiErrMsg(null);
      const response = await customerAuthAPI.signup({
        Email: data.Email || data.email,
        Password: data.Password || data.pwd || data.password,
        FirstName: data.FirstName || data.name || data.firstName,
        LastName: data.LastName || data.surname || data.lastName,
        DRN: data.DRN || data.drn,
        Phone: data.Phone || data.phone || undefined,
      });
      const token = response.token;
      const userData = response.user;
      sessionStorage.setItem("Token", token);
      sessionStorage.setItem("user", JSON.stringify(userData));
      window.location.reload();
      return;
    } catch (err) {
      if (err.message.includes("Failed to fetch")) {
        setApiErrMsg("No Server Response");
      } else if (err.message.includes("already") || err.message.includes("409")) {
        setApiErrMsg("Account already registered");
      } else if (err.message.includes("not found") || err.message.includes("meter")) {
        setApiErrMsg("Meter number (DRN) not found in system");
      } else {
        setApiErrMsg(err.message || "Registration Failed");
      }
    }
  };

  const handeSetUser = () => {
    const token = sessionStorage.getItem("Token");
    const savedUser = sessionStorage.getItem("user");
    if (token) {
      setUser(token);
      if (savedUser) {
        try {
          setUserInfo(JSON.parse(savedUser));
        } catch (e) {
          // ignore parse error
        }
      }
    }
  };

  const HandleLogOut = () => {
    setUser(null);
    setUserInfo(null);
    sessionStorage.removeItem("Token");
    sessionStorage.removeItem("user");
  };

  useEffect(() => {
    handeSetUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, userInfo, apiCallLogin, apiCallRegister, ApiErrMsg, HandleLogOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

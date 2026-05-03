import React, { useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import axios from "axios";

/**
 * @module Contexts
 */

/**
 * AuthProvider component that wraps its children with AuthContext.Provider
 * to provide authentication state and functions.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The children components to be wrapped by the provider.
 * @returns {JSX.Element} The rendered component.
 */
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [ApiErrMsg, setApiErrMsg] = useState(null);

  /**
   * Function to handle the login API call.
   *
   * @async
   * @param {Object} data - The login data.
   * @param {string} data.email - The user's email.
   * @param {string} data.password - The user's password.
   * @returns {Promise<void>}
   */
  const apiCallLogin = async (data) => {
    try {
      setApiErrMsg(null);
      const response = await axios.post(
        "https://backend1.gridxmeter.com/signin",
        data,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const token = response.data.token;
      setUser(token);
      sessionStorage.setItem("Token", token);
      if (user == null) {
        setUser(token);
      }
    } catch (err) {
      if (!err.response) {
        setApiErrMsg("No Server Response");
      } else if (err.response.status === 400) {
        setApiErrMsg("Missing email or Password");
      } else if (err.response.status === 401) {
        setApiErrMsg("Unauthorized");
      } else {
        setApiErrMsg("Login Failed");
      }
    }
  };

  /**
   * Function to handle the registration API call.
   *
   * @async
   * @param {Object} data - The registration data.
   * @param {string} data.email - The user's email.
   * @param {string} data.password - The user's password.
   * @returns {Promise<void>}
   */
  const apiCallRegister = async (data) => {
    try {
      setApiErrMsg(null);
      const response = await axios.post(
        "https://backend1.gridxmeter.com/signup",
        data,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const token = response.data.token;
      setUser(token);
      console.log("this is the user context", user);
      sessionStorage.setItem("Token", token);
    } catch (err) {
      if (!err?.response) {
        setApiErrMsg("No Server Response");
      } else if (err.response?.status === 409) {
        setApiErrMsg("Account already registered");
      } else {
        setApiErrMsg("Registration Failed");
      }
    }
  };

  /**
   * Function to set the user from the session storage.
   */
  const handeSetUser = () => {
    const token = sessionStorage.getItem("Token");
    if (token !== null && token !== undefined) {
      setUser(token);
    }
  };

  /**
   * Function to handle user logout.
   */
  const HandleLogOut = () => {
    setUser(null);
    sessionStorage.removeItem("Token");
  };

  /**
   * useEffect hook to set the user from session storage on component mount.
   */
  useEffect(() => {
    handeSetUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, apiCallLogin, apiCallRegister, ApiErrMsg, HandleLogOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import ForgotPassword from "../scenes/Authorization/ForgetPassword/forgot-password";
import ResetPassword from "../scenes/Authorization/ResetPassword/reset-password";
import LoginDesktop from "../scenes/Authorization/Desktop/LoginNew/Login";

import { useMediaQuery } from "@mui/material";
import MobileLoginRegisterForm from "../scenes/Authorization/Mobile/MobileLoginRegisterForm";

/**
 * @module Routes
 */

/**
 * AuthRoutes component sets up the routes for the authentication related pages.
 * It dynamically switches between mobile and desktop login/register forms based on the screen size.
 *
 * @component
 * @returns {JSX.Element} The rendered component.
 */
function AuthRoutes() {
  const navigate = useNavigate();
  
  /**
   * State to determine if the view is mobile.
   * @type {[boolean, Function]}
   */
  const [isMobile, setIsMobile] = useState(false);

  /**
   * useEffect hook to handle the window resize event.
   * It adjusts the `isMobile` state based on the window width.
   */
  useEffect(() => {
    /**
     * Handles the window resize event to check if the screen width is less than 900 pixels.
     */
    const handleResize = () => {
      setIsMobile(window.innerWidth < 900); // Adjust the screen width breakpoint as needed
    };

    handleResize(); // Set initial screen size

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Routes>
      <Route
        path="*"
        element={isMobile ? <MobileLoginRegisterForm /> : <LoginDesktop />}
      />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Routes>
  );
}

export default AuthRoutes;

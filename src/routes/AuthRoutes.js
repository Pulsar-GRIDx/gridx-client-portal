import React from "react";
import { Routes, Route } from "react-router-dom";
import ForgotPassword from "../scenes/Authorization/ForgetPassword/forgot-password";
import ResetPassword from "../scenes/Authorization/ResetPassword/reset-password";
import LoginDesktop from "../scenes/Authorization/Desktop/LoginNew/Login";

function AuthRoutes() {
  return (
    <Routes>
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="*" element={<LoginDesktop />} />
    </Routes>
  );
}

export default AuthRoutes;

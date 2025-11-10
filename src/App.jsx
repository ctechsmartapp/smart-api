import * as React from "react";
import { CssVarsProvider } from "@mui/joy/styles";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";

import LoginForm from "./features/auth/LoginForm";
import SignupForm from "./features/auth/SignupForm";
import ForgotPasswordForm from "./features/auth/ForgotPasswordForm";
import HomePage from "./features/home/HomePage";
import OTPForm from "./features/auth/OTPForm";
import ResetPasswordForm from "./features/auth/ResetPassword";
import ConsultantDetails from "./features/home/ConsultantDetails";

export default function App() {
  return (
    <CssVarsProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Auth Routes */}
            <Route
              path="/"
              element={
                <AuthLayout>
                  <LoginForm />
                </AuthLayout>
              }
            />
            <Route
              path="/signup"
              element={
                <AuthLayout>
                  <SignupForm />
                </AuthLayout>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <AuthLayout>
                  <ForgotPasswordForm />
                </AuthLayout>
              }
            />
            <Route
              path="/verify-otp"
              element={
                <AuthLayout>
                  <OTPForm />
                </AuthLayout>
              }
            />
            <Route
              path="/reset-password"
              element={
                <AuthLayout>
                  <ResetPasswordForm/>
                </AuthLayout>
              }
            />

            {/* Protected Routes */}
            <Route
              path="/home"
              element={
                <PrivateRoute>
                  <MainLayout>
                    <HomePage />
                  </MainLayout>
                </PrivateRoute>
              }
             
            />
             <Route
               path="/add-consultant"
              element={<ConsultantDetails />}
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </CssVarsProvider>
  );
}

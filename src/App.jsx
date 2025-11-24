import * as React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
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
import SubmissionList from "./features/home/SubmissionsList";

// ✅ Create a Material theme
const theme = createTheme({
  palette: {
    mode: "light", // or 'dark'
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
});

export default function App() {
  return (
    // ✅ Pass the theme to ThemeProvider
    <ThemeProvider theme={theme}>
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
                  <ResetPasswordForm />
                </AuthLayout>
              }
            />
            <Route
              path="/submissions"
              element={
                <PrivateRoute>
                  <MainLayout>
                    <SubmissionList />
                  </MainLayout>
                </PrivateRoute>
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
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

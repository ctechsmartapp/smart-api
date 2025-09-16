import * as React from "react";
import { CssVarsProvider } from "@mui/joy/styles";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Sheet from "@mui/joy/Sheet";
import logo from "./assets/image/CTI.png";

import ModeToggle from "./ModeToggle";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import HomePage from "./components/HomePage";

export default function App() {
  const [showLogin, setShowLogin] = React.useState(true);
  const [token, setToken] = React.useState(localStorage.getItem("token"));

  return (
    <CssVarsProvider>
      <BrowserRouter>
        <img
          src={logo}
          alt="Logo"
          style={{ position: "absolute", top: 16, left: 16, height: 100, width: 400 }}
        />

        <Routes>
          {/* Public Route */}
          <Route
            path="/"
            element={
              token ? (
                <Navigate to="/home" />
              ) : (
                <Sheet
                  sx={{
                    width: 300,
                    mx: "auto",
                    my: 8,
                    py: 3,
                    px: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    borderRadius: "sm",
                    boxShadow: "md",
                  }}
                >
                  {showLogin ? (
                    <LoginForm
                      onToggle={() => setShowLogin(false)}
                      onAuth={(t) => setToken(t)}
                    />
                  ) : (
                    <SignupForm
                      onToggle={() => setShowLogin(true)}
                      onAuth={(t) => setToken(t)}
                    />
                  )}
                </Sheet>
              )
            }
          />

          {/* Protected Route */}
          <Route
            path="/home"
            element={
              token ? (
                <HomePage onLogout={() => setToken(null)} />
              ) : (
                <Navigate to="/" />
              )
            }
          />

          {/* Catch all unmatched paths */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

        {/* <div style={{ position: "absolute", top: 16, right: 16 }}>
          <ModeToggle />
        </div> */}
      </BrowserRouter>
    </CssVarsProvider>
  );
}

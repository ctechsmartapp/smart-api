import React from "react";
import Paper from "@mui/material/Paper";

export default function AuthLayout({ children }) {
  return (
    <Paper
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
      {children}
    </Paper>
  );
}

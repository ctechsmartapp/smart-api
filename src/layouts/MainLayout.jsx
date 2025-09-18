import React from "react";
import logo from "../assets/image/CTI.png";

export default function MainLayout({ children }) {
  return (
    <div>
      {/* Header */}
      <div
        style={{
          padding: "1rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#f5f5f5",
          borderBottom: "1px solid #ddd",
        }}
      >
        <img src={logo} alt="Logo" style={{ height: 60, width: "auto" }} />
      </div>

      {/* Page content */}
      <div style={{ padding: "2rem" }}>{children}</div>
    </div>
  );
}

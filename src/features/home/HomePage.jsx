import React, { useContext } from "react";
import Navbar from "../home/Navbar.jsx"
import { AuthContext } from "../../context/AuthContext.jsx";
import { ROLES } from "../../constants/roles.js";

import ConsultantList from "./ConsultantList.jsx";
// import MarketerDashboard from "./MarketerDashboard.jsx";
// import ConsultantDashboard from "./ConsultantDashboard.jsx";

export default function HomePage() {
  const { user } = useContext(AuthContext); 
  console.log(user);
  const renderDashboard = () => {
    switch (user?.role) {
      case ROLES.ADMIN:
        return <ConsultantList />;
      case ROLES.MARKETER:
        return <ConsultantList />;
      case ROLES.CONSULTANT:
        return <ConsultantList />;
      default:
        return <p>Role not recognized</p>;
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: "1rem" }}>{renderDashboard()}</div>
    </>
  );
}

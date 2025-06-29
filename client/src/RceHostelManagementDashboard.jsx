import React from "react";
import Studentdashboard from "./Studentdashboard";

const RceHostelManagementDashboard = () => {
  return (
    <div style={{ height: "auto", margin: 0, padding: 0, overflow: "hidden" }}>
      <Studentdashboard />
      <div className="background-image" style={{ height: "100vh", width: "100%", paddingTop: "56px", marginTop: 0 }}>
        {/* Background image applied via CSS */}
      </div>
    </div>
  );
};

export default RceHostelManagementDashboard;

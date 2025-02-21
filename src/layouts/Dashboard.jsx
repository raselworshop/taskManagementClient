import React from "react";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import DashboardLayout from "../pages/DashboardLayout/DashboardLayout";

const Dashboard = () => {
  return (
    <div>
      <Navbar />
      <div className="mt-14 md:mt-20">
        <DashboardLayout />
      </div>
      <div className="mb-0 flex items-center justify-center">
        <p>
          Copyright © {new Date().getFullYear()} - All right reserved by ACME
          Industries Ltd
        </p>
      </div>
    </div>
  );
};

export default Dashboard;

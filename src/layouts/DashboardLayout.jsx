import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="dashboard-layout">
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className={`main-content ${collapsed ? "collapsed" : ""}`}>
        <Header
          onToggleSidebar={() => setCollapsed(!collapsed)}
          onMobileMenu={() => setMobileOpen(true)}
        />
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
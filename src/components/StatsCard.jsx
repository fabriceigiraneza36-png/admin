import React from "react";

export default function StatsCard({ title, value, icon: Icon, color = "green" }) {
  return (
    <div className="stat-card">
      <div className="stat-info">
        <h3>{value}</h3>
        <p>{title}</p>
      </div>
      <div className={`stat-icon ${color}`}>
        <Icon />
      </div>
    </div>
  );
}
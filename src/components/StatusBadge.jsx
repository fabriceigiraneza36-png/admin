import React from "react";

const statusColors = {
  active: "green",
  published: "green",
  confirmed: "green",
  completed: "green",
  paid: "green",
  pending: "yellow",
  unpaid: "yellow",
  draft: "gray",
  inactive: "gray",
  cancelled: "red",
  rejected: "red",
  read: "blue",
};

export default function StatusBadge({ status }) {
  const color = statusColors[status?.toLowerCase()] || "gray";
  return (
    <span className={`badge badge-${color}`}>
      {status?.charAt(0).toUpperCase() + status?.slice(1)}
    </span>
  );
}
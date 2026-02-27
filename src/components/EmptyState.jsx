import React from "react";
import { HiOutlineInbox } from "react-icons/hi";

export default function EmptyState({
  icon: Icon = HiOutlineInbox,
  message = "No data found",
  description,
  action,
}) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Icon />
      </div>
      <h3>{message}</h3>
      {description && <p>{description}</p>}
      {action}
    </div>
  );
}
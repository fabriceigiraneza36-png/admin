import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  HiOutlineHome,
  HiOutlineGlobe,
  HiOutlineMap,
  HiOutlineNewspaper,
  HiOutlineLightBulb,
  HiOutlineBriefcase,
  HiOutlineUserGroup,
  HiOutlinePhotograph,
  HiOutlineCalendar,
  HiOutlineQuestionMarkCircle,
  HiOutlineMail,
  HiOutlineDocument,
  HiOutlineVideoCamera,
  HiOutlineUsers,
  HiOutlineCog,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from "react-icons/hi";

const navSections = [
  {
    title: "Main",
    items: [
      { path: "/", icon: HiOutlineHome, label: "Dashboard", exact: true },
    ],
  },
  {
    title: "Content",
    items: [
      { path: "/countries", icon: HiOutlineGlobe, label: "Countries" },
      { path: "/destinations", icon: HiOutlineMap, label: "Destinations" },
      { path: "/posts", icon: HiOutlineNewspaper, label: "Blog Posts" },
      { path: "/tips", icon: HiOutlineLightBulb, label: "Travel Tips" },
      { path: "/services", icon: HiOutlineBriefcase, label: "Services" },
      { path: "/virtual-tours", icon: HiOutlineVideoCamera, label: "Virtual Tours" },
      { path: "/gallery", icon: HiOutlinePhotograph, label: "Gallery" },
      { path: "/pages", icon: HiOutlineDocument, label: "Pages" },
    ],
  },
  {
    title: "Management",
    items: [
      { path: "/bookings", icon: HiOutlineCalendar, label: "Bookings" },
      { path: "/messages", icon: HiOutlineMail, label: "Messages" },
      { path: "/faqs", icon: HiOutlineQuestionMarkCircle, label: "FAQs" },
      { path: "/team", icon: HiOutlineUserGroup, label: "Team" },
      { path: "/subscribers", icon: HiOutlineUsers, label: "Subscribers" },
    ],
  },
  {
    title: "System",
    items: [
      { path: "/settings", icon: HiOutlineCog, label: "Settings" },
    ],
  },
];

export default function Sidebar({ collapsed, mobileOpen, onCloseMobile }) {
  const location = useLocation();

  return (
    <>
      {mobileOpen && (
        <div
          className="modal-overlay"
          style={{ zIndex: 99 }}
          onClick={onCloseMobile}
        />
      )}
      <aside
        className={`sidebar ${collapsed ? "collapsed" : ""} ${
          mobileOpen ? "mobile-open" : ""
        }`}
      >
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">T</div>
          <div className="sidebar-brand-text">
            <h2>Travel Admin</h2>
            <span>Management Panel</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navSections.map((section) => (
            <div key={section.title}>
              <div className="nav-section-title">{section.title}</div>
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.exact}
                  className={({ isActive }) =>
                    `nav-item ${isActive ? "active" : ""}`
                  }
                  onClick={onCloseMobile}
                >
                  <item.icon className="nav-icon" />
                  <span className="nav-text">{item.label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
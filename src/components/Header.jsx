import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  HiOutlineMenu,
  HiOutlineBell,
  HiOutlineLogout,
  HiOutlineCog,
  HiOutlineUser,
} from "react-icons/hi";

const pageTitles = {
  "/": { title: "Dashboard", sub: "Overview of your travel platform" },
  "/countries": { title: "Countries", sub: "Manage countries" },
  "/destinations": { title: "Destinations", sub: "Manage destinations" },
  "/posts": { title: "Blog Posts", sub: "Manage blog content" },
  "/tips": { title: "Travel Tips", sub: "Manage travel tips" },
  "/services": { title: "Services", sub: "Manage services" },
  "/team": { title: "Team", sub: "Manage team members" },
  "/gallery": { title: "Gallery", sub: "Manage photo gallery" },
  "/bookings": { title: "Bookings", sub: "Manage bookings" },
  "/faqs": { title: "FAQs", sub: "Manage FAQs" },
  "/messages": { title: "Messages", sub: "Contact messages" },
  "/pages": { title: "Pages", sub: "Static pages" },
  "/virtual-tours": { title: "Virtual Tours", sub: "Manage virtual tours" },
  "/subscribers": { title: "Subscribers", sub: "Newsletter subscribers" },
  "/settings": { title: "Settings", sub: "Account settings" },
};

export default function Header({ onToggleSidebar, onMobileMenu }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const basePath = "/" + (location.pathname.split("/")[1] || "");
  const pageInfo = pageTitles[basePath] || { title: "Page", sub: "" };

  useEffect(() => {
    const handle = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header-left">
        <button
          className="header-btn"
          onClick={onMobileMenu}
          style={{ display: "none" }}
          id="mobile-menu-btn"
        >
          <HiOutlineMenu />
        </button>
        <button className="header-btn" onClick={onToggleSidebar}>
          <HiOutlineMenu />
        </button>
        <div>
          <h1>{pageInfo.title}</h1>
          <p>{pageInfo.sub}</p>
        </div>
      </div>

      <div className="header-right">
        <button className="header-btn">
          <HiOutlineBell />
          <span className="badge" />
        </button>

        <div ref={dropdownRef} style={{ position: "relative" }}>
          <div
            className="user-menu"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className="user-avatar">
              {user?.full_name?.charAt(0) || "A"}
            </div>
            <div className="user-info">
              <div className="name">{user?.full_name || "Admin"}</div>
              <div className="role">{user?.role || "admin"}</div>
            </div>
          </div>

          {dropdownOpen && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                width: 200,
                background: "var(--white)",
                borderRadius: "var(--radius-md)",
                boxShadow: "var(--shadow-lg)",
                border: "1px solid var(--gray-100)",
                overflow: "hidden",
                zIndex: 60,
                animation: "fadeIn 0.15s ease",
              }}
            >
              <button
                className="btn-ghost"
                style={{
                  width: "100%",
                  justifyContent: "flex-start",
                  borderRadius: 0,
                  padding: "12px 16px",
                }}
                onClick={() => {
                  setDropdownOpen(false);
                  navigate("/settings");
                }}
              >
                <HiOutlineCog /> Settings
              </button>
              <div style={{ height: 1, background: "var(--gray-100)" }} />
              <button
                className="btn-ghost"
                style={{
                  width: "100%",
                  justifyContent: "flex-start",
                  borderRadius: 0,
                  padding: "12px 16px",
                  color: "var(--red-500)",
                }}
                onClick={handleLogout}
              >
                <HiOutlineLogout /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
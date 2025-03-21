import React from "react";
import { Link, useNavigate } from "react-router-dom";  // Import useNavigate from react-router-dom
import "./Sidebar.scss";  // Make sure to create this CSS file for styling

const SidebarOwner = () => {
  const navigate = useNavigate();  // Initialize navigate function

  // Logout handler
  const handleLogout = () => {
    // Clear session data, tokens, etc.
    localStorage.removeItem('userToken');
    sessionStorage.clear();
    document.cookie = "userToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";

    // Redirect to home page
    navigate("/");  // Redirect to home page after logging out
  };

  return (
    <div className="sidebar">
      <h3 className="sidebar-title">Owner Portal</h3>
      <ul className="sidebar-links">
        <li>
          <Link to="/Owner/OwnerDetails" className="sidebar-link">
            Owner Details
          </Link>
        </li>
        <li>
          <Link to="/Owner/OwnerRegisterOwner" className="sidebar-link">
            Register New Owner
          </Link>
        </li>
        <li>
          <Link to="/Owner/OwnerRegisterAdmin" className="sidebar-link">
            Register New Admin
          </Link>
        </li>
        <li>
          <Link to="/Owner/OwnerAddLibraries" className="sidebar-link">
            Add New Library
          </Link>
        </li>
        <li>
          <Link to="/Owner/ListLibraries" className="sidebar-link">
            List Libraries
          </Link>
        </li>

        {/* Logout Button */}
        <li>
          <button onClick={handleLogout} className="sidebar-link logout-btn">
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default SidebarOwner;
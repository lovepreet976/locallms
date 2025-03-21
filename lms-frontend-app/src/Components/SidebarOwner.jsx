import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Sidebar.scss";

const SidebarOwner = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    sessionStorage.clear();
    document.cookie = "userToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    navigate("/");
  };

  return (
    <>
      {/* Floating toggle button for small screens */}
      <button className="sidebar-toggle-floating" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "⟨" : "⟩"}
      </button>

      <div className={`sidebar ${isOpen ? "active" : ""}`}>
        <div className="sidebar-header">
          <h3 className="sidebar-title">Owner Portal</h3>
        </div>

        <ul className="sidebar-links">
          <li><Link to="/Owner/OwnerDetails" className="sidebar-link">Owner Details</Link></li>
          <li><Link to="/Owner/OwnerRegisterOwner" className="sidebar-link">Register New Owner</Link></li>
          <li><Link to="/Owner/OwnerRegisterAdmin" className="sidebar-link">Register New Admin</Link></li>
          <li><Link to="/Owner/OwnerAddLibraries" className="sidebar-link">Add New Library</Link></li>
          <li><Link to="/Owner/OwnerListLibraries" className="sidebar-link">List Libraries</Link></li>
          <li><button onClick={handleLogout} className="sidebar-link logout-btn">Logout</button></li>
        </ul>
      </div>
    </>
  );
};

export default SidebarOwner;

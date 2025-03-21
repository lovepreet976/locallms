import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Sidebar.scss";

const SidebarAdmin = () => {
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
          <h3 className="sidebar-title">Admin Portal</h3>
        </div>

        <ul className="sidebar-links">
          <li><Link to="/Admin/AdminDetails" className="sidebar-link">Admin Details</Link></li>
          <li><Link to="/Admin/AdminListRequests" className="sidebar-link">List Requests</Link></li>
          <li><Link to="/Admin/AdminAddBook" className="sidebar-link">Add New Book</Link></li>
          <li><Link to="/Admin/AdminUpdateBook" className="sidebar-link">Update Book</Link></li>
          <li><Link to="/Admin/AdminRemoveBook" className="sidebar-link">Remove Book</Link></li>
          <li><button onClick={handleLogout} className="sidebar-link logout-btn">Logout</button></li>
        </ul>
      </div>
    </>
  );
};

export default SidebarAdmin;

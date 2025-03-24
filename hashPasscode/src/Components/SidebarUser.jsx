import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Sidebar.scss";

const SidebarUser = () => {
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
          <h3 className="sidebar-title">User Portal</h3>
        </div>

        <ul className="sidebar-links">
          <li><Link to="/User/UserDetails" className="sidebar-link">User Details</Link></li>
          <li><Link to="/User/UserSearchBook" className="sidebar-link">Search For a Book</Link></li>
          <li><Link to="/User/UserIssueBook" className="sidebar-link">Request a Book</Link></li>
          <li><Link to="/User/UserStatusIssue" className="sidebar-link">View Status</Link></li>
          <li><button onClick={handleLogout} className="sidebar-link logout-btn">Logout</button></li>
        </ul>
      </div>
    </>
  );
};

export default SidebarUser;

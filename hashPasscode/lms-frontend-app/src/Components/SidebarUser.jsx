import React from "react";
import { Link, useNavigate } from "react-router-dom";  // Import useNavigate from react-router-dom
import "./Sidebar.scss";  // Make sure to create this CSS file for styling

const SidebarUser = () => {
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
      <h3 className="sidebar-title">User Portal</h3>
      <ul className="sidebar-links">
        <li>
          <Link to="/User/UserDetails" className="sidebar-link">
            User Details
          </Link>
        </li>
        <li>
          <Link to="/User/UserIssueBook" className="sidebar-link">
            Search For a Book
          </Link>
        </li>
        <li>
          <Link to="/User/UserIssueBook" className="sidebar-link">
            Issue a Book
          </Link>
        </li>
        <li>
          <Link to="/User/UserStatusIssue" className="sidebar-link">
            View Status
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

export default SidebarUser;
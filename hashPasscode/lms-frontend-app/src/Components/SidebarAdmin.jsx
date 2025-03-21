import React from "react";
import { Link, useNavigate } from "react-router-dom";  // Import useNavigate from react-router-dom
import "./Sidebar.scss";  // Make sure to create this CSS file for styling

const SidebarAdmin = () => {
  // Initialize the navigate function
  const navigate = useNavigate();

  // Logout handler
  const handleLogout = () => {
    // Clear session data and cookies
    localStorage.removeItem('userToken'); 
    sessionStorage.clear(); 
    document.cookie = "userToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";

    // Navigate to the home page
    navigate("/");  // Redirect to the home page
  }

  return (
    <div className="sidebar">
      <h3 className="sidebar-title">Admin Portal</h3>
      <ul className="sidebar-links">
        <li>
          <Link to="/Admin/AdminDetails" className="sidebar-link">
            Admin Details
          </Link>
        </li>
        <li>
          <Link to="/Admin/AdminListRequests" className="sidebar-link">
            List Requests
          </Link>
        </li>
        <li>
          <Link to="/Admin/AdminAD" className="sidebar-link">
            Approve/Disapprove Request
          </Link>
        </li>
        <li>
          <Link to="/Admin/AdminAddBook" className="sidebar-link">
            Add New Book
          </Link>
        </li>
        <li>
          <Link to="/Admin/AdminUpdateBook" className="sidebar-link">
            Update Book
          </Link>
        </li>
        <li>
          <Link to="/Admin/AdminRemoveBook" className="sidebar-link">
            Delete Book
          </Link>
        </li>
        <li>
          <Link to="/Admin/AdminIssue" className="sidebar-link">
            Issue Book
          </Link>
        </li>

        <li>
          {/* Logout Button */}
          <button onClick={handleLogout} className="sidebar-link logout-btn">
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default SidebarAdmin;
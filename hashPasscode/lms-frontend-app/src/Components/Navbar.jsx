import React from 'react';
import { Link } from 'react-router-dom';  // Import Link from react-router-dom for routing
import "./Navbar.scss";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="site-info">
        <div className="vertical-line"></div>
        <div className="site-name">
          <h4>Library Management System</h4>
        </div>
      </div>
      <div className="page-sections">
        <div className="page-section">
          <Link to="/">Home</Link> {/* Use Link for React Router */}
        </div>
        <div className="page-section">
          <Link to="/libraries">Libraries</Link> {/* Add navigation for Libraries */}
        </div>
        <div className="page-section">
          <Link to="/about">About Us</Link> {/* Add navigation for About Us */}
        </div>
        <div className="page-section">
          <Link to="/terms">T&C</Link> {/* Add navigation for T&C */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
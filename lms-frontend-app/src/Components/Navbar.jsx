import React, { useState } from "react";
import { Link } from "react-router-dom"; 
import "./Navbar.scss";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="site-info">
        <div className="vertical-line"></div>
        <div className="site-name">
          <h4>Library Management System</h4>
        </div>
      </div>

      <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>

      <div className={`page-sections ${menuOpen ? "open" : ""}`}>
        <div className="page-section">
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
        </div>
        <div className="page-section">
          <Link to="/ListLibraries" onClick={() => setMenuOpen(false)}>Libraries</Link>
        </div>
        <div className="page-section">
          <Link to="/AboutUs" onClick={() => setMenuOpen(false)}>About Us</Link>
        </div>
        <div className="page-section">
          <Link to="/TnC" onClick={() => setMenuOpen(false)}>T&C</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

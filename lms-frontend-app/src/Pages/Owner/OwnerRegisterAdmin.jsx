import React, { useState } from "react";
import OwnerSidebar from "../../Components/SidebarOwner";  // Sidebar for the owner portal
import "../../Styles/Owner/Owner.scss";   // SCSS file for styling

function OwnerRegisterAdmin() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contact, setContact] = useState("");
  const [libraryIds, setLibraryIds] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    // Get the token from localStorage (assuming the token was saved during login)
    const token = localStorage.getItem("token");

    // Check if the token is available
    if (!token) {
      setError("You must be logged in as an owner to register an admin.");
      return;
    }

    const adminData = {
      name,
      email,
      password,
      contact,
      library_ids: libraryIds.split(",").map((id) => parseInt(id.trim())),
    };

    // Send the POST request to the backend with the Authorization token
    fetch("http://localhost:8080/api/admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // Include the token in the Authorization header
      },
      body: JSON.stringify(adminData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          setMessage("");
        } else {
          setMessage(data.message);
          setError("");
          setName("");
          setEmail("");
          setPassword("");
          setContact("");
          setLibraryIds(""); // Clear the input fields after successful submission
        }
      })
      .catch((error) => {
        setError("Error registering new admin: " + error.message);
        setMessage("");
      });
  };

  return (
    <div className="owner-container">
      <OwnerSidebar />
      <div className="content">
        <h2>Register New Admin</h2>

        {/* Display success or error messages */}
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="contact">Contact</label>
            <input
              type="text"
              id="contact"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Enter Contact"
            />
          </div>

          <div className="form-group">
            <label htmlFor="libraryIds">Library IDs</label>
            <input
              type="text"
              id="libraryIds"
              value={libraryIds}
              onChange={(e) => setLibraryIds(e.target.value)}
              placeholder="Enter Library IDs (comma separated)"
              required
            />
          </div>

          <button type="submit" className="submit-button">Register Admin</button>
        </form>
      </div>
    </div>
  );
}

export default OwnerRegisterAdmin;
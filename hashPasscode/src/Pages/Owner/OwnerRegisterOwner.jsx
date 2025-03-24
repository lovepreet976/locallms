import React, { useState } from "react";
import OwnerSidebar from "../../Components/SidebarOwner";  // Sidebar for the owner portal
import "../../Styles/Owner/Owner.scss";   // SCSS file for styling

function OwnerRegisterOwner() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    // Get the token from localStorage (assuming the token was saved during login)
    const token = localStorage.getItem("token");

    // Check if the token is available
    if (!token) {
      setError("You must be logged in as an owner to register a new owner.");
      return;
    }

    const ownerData = {
      name,
      email,
      password,
      contact,
      role: "owner",
    };

    // Send the POST request to the backend with the Authorization token
    fetch("http://localhost:8080/api/owner", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // Include the token in the Authorization header
      },
      body: JSON.stringify(ownerData),
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
          setContact(""); // Clear the input fields after successful submission
        }
      })
      .catch((error) => {
        setError("Error registering new owner: " + error.message);
        setMessage("");
      });
  };

  return (
    <div className="owner-container">
      <OwnerSidebar />
      <div className="content">
        <h2>Register New Owner</h2>

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

          <button type="submit" className="submit-button">Register Owner</button>
        </form>
      </div>
    </div>
  );
}

export default OwnerRegisterOwner;
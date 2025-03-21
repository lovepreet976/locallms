import React, { useState } from "react";
import OwnerSidebar from "../../Components/SidebarOwner"; // Sidebar for the owner portal
import "../../Styles/Owner/Owner.scss"; // SCSS file for styling

function OwnerAddLibraries() {
  const [libraryName, setLibraryName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    // Get the token from localStorage (assuming the token was saved during login)
    const token = localStorage.getItem("token");
    
    // Check if the token is available
    if (!token) {
      setError("You must be logged in to add a library.");
      return;
    }

    // Prepare the data to send in the POST request
    const libraryData = {
      name: libraryName,
    };

    // Send the POST request to the backend with the Authorization token
    fetch("http://localhost:8080/api/library", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // Include the token in the Authorization header
      },
      body: JSON.stringify(libraryData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          setMessage("");
        } else {
          setMessage(data.message);
          setError("");
          setLibraryName(""); // Clear the input field after successful submission
        }
      })
      .catch((error) => {
        setError("Error creating library: " + error.message);
        setMessage("");
      });
  };

  return (
    <div className="owner-container">
      <OwnerSidebar />
      <div className="content">
        <h2>Add New Library</h2>

        {/* Display success or error messages */}
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="libraryName">Library Name</label>
            <input
              type="text"
              id="libraryName"
              value={libraryName}
              onChange={(e) => setLibraryName(e.target.value)}
              placeholder="Enter Library Name"
              required
            />
          </div>
          <button type="submit" className="submit-button">Add Library</button>
        </form>
      </div>
    </div>
  );
}

export default OwnerAddLibraries;
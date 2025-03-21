import React, { useState } from "react";
import UserSidebar from "../../Components/SidebarUser"; // Import the sidebar component
import axios from "axios"; // Used for API calls
import "../../Styles/User/UserIssueBook.scss"

const UserIssueBook = () => {
  const [isbn, setIsbn] = useState("");
  const [libraryId, setLibraryId] = useState(""); // Keep it as string initially for input
  const [message, setMessage] = useState("");

  const handleIssueBook = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("token"); // Get token from localStorage
    if (!token) {
      setMessage("No token found. Please log in again.");
      return;
    }

    // Convert libraryId to a number (ensure it's valid)
    const numericLibraryId = Number(libraryId);

    if (isNaN(numericLibraryId)) {
      setMessage("Please enter a valid numeric Library ID.");
      return;
    }

    try {
      // Make the API call to request the book
      const response = await axios.post("http://localhost:8080/api/issue", {
        isbn: isbn,
        libraryid: numericLibraryId, // Send libraryId as a number
      }, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in the Authorization header
        },
      });

      setMessage(response.data.message); // Display success message
    } catch (error) {
      setMessage(error.response?.data?.error || "An error occurred");
    }
  };

  return (
    <div className="user-issue-container">
      <UserSidebar />
      <div className="content">
        <h2>Request a Book</h2>
        <form className="issue-form" onSubmit={handleIssueBook}>
          <div className="form-group">
            <label htmlFor="isbn">Book ISBN:</label>
            <input
              type="text"
              id="isbn"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="libraryId">Library ID:</label>
            <input
              type="text"
              id="libraryId"
              value={libraryId}
              onChange={(e) => setLibraryId(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-btn">
            Request Book
          </button>
          {message && <p>{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default UserIssueBook;
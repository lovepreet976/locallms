import React, { useState, useEffect } from "react";
import UserSidebar from "../../Components/SidebarUser";  // Import the sidebar component
import axios from "axios"; // Assuming you're using axios for API calls
import "../../Styles/User/UserStatusIssue.scss"

const UserStatusIssue = () => {
  const [requests, setRequests] = useState([]); // ✅ Store multiple requests
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch the status of all book issue requests when the component is mounted
  useEffect(() => {
    const fetchStatus = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No token found. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:8080/api/issue/status", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setRequests(response.data.requests || []); // ✅ Store the array of requests
        setError("");
      } catch (err) {
        setRequests([]); // ✅ Ensure requests are cleared on error
        setError(err.response?.data?.error || "Unable to fetch issue status");
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []); // Empty dependency array to ensure it runs only once on mount

  const formatDate = (timestamp) => {
    if (!timestamp || isNaN(timestamp)) return "N/A";
    return new Date(timestamp * 1000).toLocaleString();
  };

  return (
    <div className="status-issue-container">
      <UserSidebar />
      <div className="content">
        <h2>Check Book Issue Status</h2>

        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading...</p>
          </div>
        ) : error ? (
          <p className="error-message">{error}</p> // ✅ Show error message if any
        ) : requests.length === 0 ? (
          <p className="no-status">No requests found.</p> // ✅ Handle empty requests
        ) : (
          <div className="status-section">
            {requests.map((request) => (
              <div key={request.request_id} className="status-details">
                <p><strong>Request ID:</strong> {request.request_id}</p>
                <p><strong>Book ID:</strong> {request.book_id}</p>
                <p><strong>Library ID:</strong> {request.library_id}</p>
                <p><strong>Request Date:</strong> {formatDate(request.request_date)}</p>
                <p><strong>Status:</strong> {request.status}</p>
                {request.approval_date && (
                  <p><strong>Approval Date:</strong> {formatDate(request.approval_date)}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserStatusIssue;

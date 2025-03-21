import React, { useEffect, useState } from 'react';
import "../../Styles/OwnerDetails.scss";
import AdminSidebar from "../../Components/SidebarAdmin.jsx"; 

function AdminDetails() {
  const [adminDetails, setAdminDetails] = useState(null);
  const [libraries, setLibraries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const details = JSON.parse(localStorage.getItem('userDetails'));
    setAdminDetails(details);

    // Fetch libraries associated with this admin (you may need to replace the URL)
    const fetchLibraries = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/libraries?adminId=${details.id}`);
        const data = await response.json();
        setLibraries(data);
      } catch (error) {
        console.error('Error fetching libraries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLibraries();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!adminDetails) {
    return <div>Admin details not found</div>;
  }

  return (
    <div className="details-container">
      <AdminSidebar />
      <h2>Admin Details</h2>

      {/* Display Admin's Basic Details */}
      <div className="detail">
          <strong>ID:</strong> {adminDetails.ID}
        </div>
      <div className="detail">
        <strong>Name:</strong> {adminDetails.Name}
      </div>
      <div className="detail">
        <strong>Email:</strong> {adminDetails.Email}
      </div>
      <div className="detail">
          <strong>Contact:</strong> {adminDetails.Contact}
        </div>
        <div className="detail">
          <strong>Role:</strong> {adminDetails.role}
        </div>
      {/* Display Libraries Managed by Admin */}
      {libraries.length > 0 ? (
        <div className="libraries">
          <h3>Libraries Managed by Admin</h3>
          <ul>
            {libraries.map((library, index) => (
              <li key={index}>{library.name}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div>No libraries found</div>
      )}
    </div>
  );
}

export default AdminDetails;
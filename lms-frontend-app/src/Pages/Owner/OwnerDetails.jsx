import React, { useEffect, useState } from "react";
import OwnerSidebar from "../../Components/SidebarOwner.jsx";  // Sidebar for the owner portal
import "../../Styles/Owner/Owner.scss";  // Add CSS for styling the details

const OwnerDetails = () => {
  const [ownerDetails, setOwnerDetails] = useState(null);

  useEffect(() => {
    const details = JSON.parse(localStorage.getItem('userDetails'));
    setOwnerDetails(details);
  }, []);

  if (!ownerDetails) {
    return <div>No owner details available</div>;}

  return (
    <div className="owner-container">
      <OwnerSidebar />
      <div className="content">
      <h2>Owner Details</h2>
      <div className="detail">
          <strong>ID:</strong> {ownerDetails.ID}
      </div>
      <div className="detail">
        <strong>Name:</strong> {ownerDetails.Name}
      </div>
      <div className="detail">
        <strong>Email:</strong> {ownerDetails.Email}
      </div>
      <div className="detail">
          <strong>Contact:</strong> {ownerDetails.Contact}
      </div>
     
      <div className="detail">
          <strong>Role:</strong> {ownerDetails.Role}
        </div>
    </div>
    </div>
  );
}

export default OwnerDetails;
import React, { useEffect, useState } from "react";
import OwnerSidebar from "../../Components/SidebarOwner.jsx";  // Sidebar for the owner portal
import "../../Styles/OwnerDetails.scss";  // Add CSS for styling the details

const OwnerDetails = () => {
  const [ownerData, setOwnerData] = useState(null);

  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    console.log('Fetched userDetails:', userDetails); // Log the fetched details

    if (userDetails && userDetails.role === 'owner') {
      setOwnerData(userDetails); // This will be your user object including contact, name, etc.
    } else {
      console.log('No owner data found in localStorage or role is not owner');
    }
  }, []); // Empty dependency array ensures this runs once when the component mounts

  return (
    <div className="owner-details">
      <OwnerSidebar />
      {ownerData ? (
        <div>
          <h2>Owner Details</h2>
          <p><strong>ID:</strong> {userDetails.ID}</p>
          <p><strong>Name:</strong> {userDetails.Name}</p>
          <p><strong>Email:</strong> {userDetails.Email}</p>
          <p><strong>Contact:</strong> {userDetails.Contact}</p>
        </div>
      ) : (
        <p>Loading owner details...</p>
      )}
    </div>
  );
};

export default OwnerDetails;
import React, { useEffect, useState } from 'react';
import UserSidebar from "../../Components/SidebarUser.jsx"; 
import "../../Styles/OwnerDetails.scss";

function UserDetails() {
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const details = JSON.parse(localStorage.getItem('userDetails'));
    setUserDetails(details);
  }, []);

  if (!userDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="details-container">
      <UserSidebar />
      <h2>User Details</h2>
      <div className="detail">
        <strong>Name:</strong> {userDetails.name}
      </div>
      <div className="detail">
        <strong>Email:</strong> {userDetails.email}
      </div>
      {/* Add more user details here */}
    </div>
  );
}

export default UserDetails;
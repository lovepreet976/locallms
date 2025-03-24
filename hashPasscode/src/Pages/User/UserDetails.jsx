import React, { useEffect, useState } from 'react';
import "../../Styles/User/UserIssueBook.scss"
import UserSidebar from "../../Components/SidebarUser.jsx"; 

function UserDetails() {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    const details = JSON.parse(localStorage.getItem('userDetails'));

    if (!details) {
      console.error('Admin details not found in localStorage');
      return; 
    }

    setUserDetails(details);
    setLoading(false);  // No need to wait for API we can load immediately
  }, []);

  // Loading State
  if (loading) {
    return <div>Loading...</div>;
  }

  // Error if Admin details are not found
  if (!userDetails) {
    return <div>User details not found</div>;
  }

  return (
    <div className="user-container">
      <UserSidebar />
      <div className="content">
      <h2>User Details</h2>

      <div className="detail">
        <strong>ID:</strong> {userDetails.ID}
      </div>
      <div className="detail">
        <strong>Name:</strong> {userDetails.Name}
      </div>
      <div className="detail">
        <strong>Email:</strong> {userDetails.Email}
      </div>
      <div className="detail">
        <strong>Contact:</strong> {userDetails.Contact}
      </div>
      <div className="detail">
        <strong>Role:</strong> {userDetails.Role}
      </div>
      
      {userDetails.Libraries && userDetails.Libraries.length > 0 ? (
        <div className="detail">
          <h3>User Libraries</h3>
          <ul>
            {userDetails.Libraries.map((library, index) => (
              <li key={index}><strong>ID:</strong>{library.ID}<strong>  Name:</strong>{library.Name}</li>  
            ))}
          </ul>
        </div>
      ) : (
        <div>No libraries found</div>
      )}
    </div>
    </div>
  );
}

export default UserDetails;
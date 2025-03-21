import React from "react";
import UserSidebar from "../../Components/SidebarUser";  // Import the sidebar component

const UserPortal = () => {
  return (
    <div className="user-portal-container">
      <UserSidebar />
      <div className="content">
        {/* Content of your owner portal page */}
        <h1>Welcome to the User Portal</h1>
        {/* You can include specific components for Registering Owners, Admins, etc., here */}
      </div>
    </div>
  );
};

export default UserPortal;
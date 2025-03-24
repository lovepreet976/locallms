import React from "react";
import UserSidebar from "../../Components/SidebarUser";  // Import the sidebar component
import "../../Styles/User/UserIssueBook.scss"

const UserPortal = () => {
  return (
    <div className="user-container">
      <UserSidebar />
      <div className="content">
        {/* Content of your owner portal page */}
        <h2>Welcome to the User Portal</h2>
        {/* You can include specific components for Registering Owners, Admins, etc., here */}
      </div>
    </div>
  );
};

export default UserPortal;

import React from "react";
import UserSidebar from "../../Components/SidebarUser";  // Import the sidebar component

const UserIssueBook = () => {
  return (
    <div >
    
    <UserSidebar />
    <div>
      {/* Content of your owner portal page */}
      <h2>UserIssueBook</h2>
      {/* You can include specific components for Registering Owners, Admins, etc., here */}
    </div>
  </div>
  );
};

export default UserIssueBook;
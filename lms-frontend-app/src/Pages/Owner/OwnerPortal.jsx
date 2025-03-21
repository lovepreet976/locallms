import React from "react";
import OwnerSidebar from "../../Components/SidebarOwner";  // Import the sidebar component
import "../../Styles/Owner/Owner.scss"; 

const OwnerPortal = () => {
  return (
    <div className="owner-container">
      <OwnerSidebar />
      <div className="content">
        {/* Content of your owner portal page */}
        <h2>Welcome to the Owner Portal</h2>
        {/* You can include specific components for Registering Owners, Admins, etc., here */}
      </div>
    </div>
  );
};

export default OwnerPortal;
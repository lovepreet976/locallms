import React from "react";
import OwnerSidebar from "../../Components/SidebarOwner";  // Import the sidebar component
import "../../Styles/Owner/Owner.scss"; 

const OwnerPortal = () => {
  return (
    <div className="owner-container">
      <OwnerSidebar />
      <div className="content">
        
        <h2>Welcome to the Owner Portal</h2>
        
      </div>
    </div>
  );
};

export default OwnerPortal;
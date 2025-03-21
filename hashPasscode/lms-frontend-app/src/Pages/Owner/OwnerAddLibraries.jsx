import React, { useEffect, useState } from "react";
import OwnerSidebar from "../../Components/SidebarOwner";  // Sidebar for the owner portal




function OwnerAddLibraries() {
    return (
      
        <div>
        <OwnerSidebar />
        <div>
          {/* Content of your owner portal page */}
          <h2>Add Libraries</h2>
          {/* You can include specific components for Registering Owners, Admins, etc., here */}
        </div>
      </div>
  
    );
  }

export default OwnerAddLibraries;
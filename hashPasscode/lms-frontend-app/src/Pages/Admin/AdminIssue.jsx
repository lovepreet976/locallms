import React from "react";
import AdminSidebar from "../../Components/SidebarAdmin";  // Import the sidebar component
//import "./adminPortal.css"
const AdminIssue = () => {
  return (
    <div >
    
        <AdminSidebar />
        <div>
          {/* Content of your owner portal page */}
          <h2>Welcome LibrariesAI</h2>
          {/* You can include specific components for Registering Owners, Admins, etc., here */}
        </div>
      </div>
  );
};

export default AdminIssue;
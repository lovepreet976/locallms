import React from "react";
import AdminSidebar from "../../Components/SidebarAdmin";  // Import the sidebar component
//import "./adminPortal.css"
const AdminPortal = () => {
  return (
    <div className="admin-portal-container">
      <AdminSidebar />
      <div className="content">
        {/* Content of your owner portal page */}
        <h1>Welcome to the admin Portal</h1>
        {/* You can include specific components for Registering Owners, Admins, etc., here */}
      </div>
    </div>
  );
};

export default AdminPortal;
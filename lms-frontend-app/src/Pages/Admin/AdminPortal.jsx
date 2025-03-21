import React from "react";
import AdminSidebar from "../../Components/SidebarAdmin";  // Import the sidebar component
import "../../Styles/Admin/Book.scss"


const AdminPortal = () => {
  return (
    <div className="book-container">
      <AdminSidebar />
      <div className="content">
        {/* Content of your owner portal page */}
        <h2>Welcome to the Admin Portal</h2>
        {/* You can include specific components for Registering Owners, Admins, etc., here */}
      </div>
    </div>
  );
};

export default AdminPortal;
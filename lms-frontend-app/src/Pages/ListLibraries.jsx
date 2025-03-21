import React, { useEffect, useState } from "react";
////import OwnerSidebar from "../../Components/SidebarOwner";  // Sidebar for the owner portal
import "../Styles/Owner/Owner.scss";  // SCSS file for styling

function ListLibraries() {
  const [libraries, setLibraries] = useState([]);

  useEffect(() => {
    // Fetch libraries from the backend
    fetch("http://localhost:8080/libraries") // Assuming the backend is running on localhost:5000
      .then(response => response.json())
      .then(data => {
        setLibraries(data.libraries); // The response should only contain ID and Name
      })
      .catch(error => {
        console.error("Error fetching libraries:", error);
      });
  }, []);

  return (
    <div className="owner-library-container">
     
      <div className="library-content">
        <h2>Library List</h2>
        {libraries.length === 0 ? (
          <p>No libraries found.</p>
        ) : (
          <div className="library-list">
            {libraries.map((library) => (
              <div className="library-card" key={library.ID}>
                <h3>{library.Name}</h3> {/* Display library name */}
                <p>Library ID: {library.ID}</p> {/* Display library ID */}

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ListLibraries;
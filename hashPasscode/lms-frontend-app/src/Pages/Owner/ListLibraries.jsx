import React, { useEffect, useState } from "react";
import OwnerSidebar from "../../Components/SidebarOwner";
import "../../Styles/OwnerListLibraries.scss";

const OwnerListLibraries = () => {
  const [libraries, setLibraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLibraries = async () => {
      try {
        const response = await fetch("http://localhost:8080/libraries");
        if (!response.ok) {
          throw new Error("Failed to fetch libraries");
        }
        const data = await response.json();

        console.log("Fetched libraries:", data); // Debugging output
        setLibraries(data.libraries || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLibraries();
  }, []);

  return (
    <div className="details-container">
      <OwnerSidebar />
      <div className="content">
        <h2>List of Libraries</h2>

        {loading && <p className="loading">Loading libraries...</p>}
        {error && <p className="error">Error: {error}</p>}

        {!loading && !error && libraries.length > 0 ? (
          <div className="library-grid">
            {libraries.map((library) => (
              <div key={library.ID} className="library-card">
                <h3>{library.Name}</h3>
                <p className="id-badge">ID: {library.ID}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-libraries">No libraries found</p>
        )}
      </div>
    </div>
  );
};

export default OwnerListLibraries;

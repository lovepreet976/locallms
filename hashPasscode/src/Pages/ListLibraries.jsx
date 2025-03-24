import React, { useEffect, useState } from "react";
import "../Styles/Owner/Owner.scss";  

function ListLibraries() {
  const [libraries, setLibraries] = useState([]);

  useEffect(() => {
    
    fetch("http://localhost:8080/libraries") 
      .then(response => response.json())
      .then(data => {
        setLibraries(data.libraries); 
      })
      .catch(error => {
        console.error("Error fetching libraries:", error);
      });
  }, []);

  return (
    <div className="owners-container">
      <div className="content">
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
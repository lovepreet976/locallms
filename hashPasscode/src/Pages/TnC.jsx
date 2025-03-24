import React from "react";
import "../Styles/AboutsUsandTNC.scss";

const TermsAndConditions = () => {
  return (
    <div className="abc-container">
      <h1>Terms and Conditions</h1>
      <p>By using our Library Management System, you agree to the following terms and conditions:</p>
      <ul>
        <li>All books must be returned within the due date.</li>
        <li>Late returns may incur a penalty.</li>
        <li>Library members must maintain the books in good condition.</li>
        <li>Any damage or loss of books must be reported immediately.</li>
        <li>The library reserves the right to suspend or terminate access for violations.</li>
      </ul>
    </div>
  );
};

export default TermsAndConditions;
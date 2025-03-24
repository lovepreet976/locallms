import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate hook
import '../Styles/Signup.scss';  // Import the CSS file for styling

function Signup() {
  const navigate = useNavigate();  // Initialize useNavigate
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [contact, setContact] = useState('');
  const [libraryIds, setLibraryIds] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSignUp = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Prepare the payload for sign up
    const signUpData = {
      name,
      email,
      password,
      contact,
      library_ids: libraryIds.split(',').map(id => parseInt(id.trim())),
    };

    try {
      const response = await fetch('http://localhost:8080/api/user', {  // Updated endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signUpData),
      });

      const result = await response.json();
      
      if (response.ok) {
        setSuccessMessage(result.message || 'User registered successfully');
        
        // Store the JWT token, role, and user details in localStorage
        localStorage.setItem('token', result.token);
        localStorage.setItem('role', 'user'); // Role is set to 'user' upon sign-up
        localStorage.setItem('userDetails', JSON.stringify(result.user));

        // Navigate to the User Portal after successful registration
        navigate('/user/userPortal');
      } else {
        setErrorMessage(result.error || 'Sign-up failed');
      }
    } catch (error) {
      setErrorMessage('An error occurred while registering. Please try again.');
      console.error(error);
    }
  };

  return (
   
    <div className="sign-up-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="contact">Contact:</label>
          <input
            type="text"
            id="contact"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="libraryIds">Library IDs (comma separated):</label>
          <input
            type="text"
            id="libraryIds"
            value={libraryIds}
            onChange={(e) => setLibraryIds(e.target.value)}
            required
          />
        </div>
        <button type="submit">Sign Up</button>
        {errorMessage && <div className="error">{errorMessage}</div>}
        {successMessage && <div className="success">{successMessage}</div>}
      </form>
    </div>
  );
}

export default Signup;

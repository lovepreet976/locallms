import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/Login.scss';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    const loginData = { email, password };

    try {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
        credentials: 'include',  // Ensures cookies or authentication tokens are included
      });

      const result = await response.json();

      if (response.ok) {
        // Store the JWT token, role, and user details in localStorage
        localStorage.setItem('token', result.token);
        localStorage.setItem('role', result.role);
        localStorage.setItem('userDetails', JSON.stringify(result.user));

        // Redirect to the appropriate portal based on the user role
        switch (result.role) {
          case 'user':
            navigate('/user/userPortal');
            break;
          case 'owner':
            navigate('/owner/ownerPortal');
            break;
          case 'admin':
            navigate('/admin/adminPortal');
            break;
          default:
            setErrorMessage('Unknown role');
        }
      } else {
        setErrorMessage(result.error || 'Login failed');
      }
    } catch (error) {
      setErrorMessage('An error occurred during login.');
    }
  };

  return (
   
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
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
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
          {errorMessage && <div className="error">{errorMessage}</div>}
        </form>
      </div>
   
  );
}

export default Login;

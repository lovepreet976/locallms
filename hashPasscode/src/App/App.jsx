import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import NavBar from "../Components/Navbar.jsx";
import LoginPage from "../Pages/Login.jsx";  
import SignUpPage from "../Pages/Signup.jsx";  

import TnC from "../Pages/TnC.jsx";  
import AboutUs from "../Pages/AboutUs.jsx";
import ListLibraries from "../Pages/ListLibraries.jsx"; 

import UserPortal from "../Pages/User/UserPortal.jsx";  // Import User Portal
import OwnerPortal from "../Pages/Owner/OwnerPortal.jsx"; // Import Owner Portal
import AdminPortal from "../Pages/Admin/AdminPortal.jsx"; // Import Admin Portal

import OwnerDetails from "../Pages/Owner/OwnerDetails.jsx";
import OwnerRegisterAdmin from "../Pages/Owner/OwnerRegisterAdmin.jsx";
import OwnerAddLibraries from "../Pages/Owner/OwnerAddLibraries.jsx";
import OwnerListLibraries from "../Pages/Owner/OwnerListLibraries.jsx";
import OwnerRegisterOwner from "../Pages/Owner/OwnerRegisterOwner.jsx";

import AdminDetails from '../Pages/Admin/AdminDetails.jsx';
import AdminListRequests from '../Pages/Admin/AdminListRequests.jsx';
import AdminAddBook from '../Pages/Admin/AdminAddBook.jsx';
import AdminUpdateBook from '../Pages/Admin/AdminUpdateBook.jsx';
import AdminRemoveBook from '../Pages/Admin/AdminRemoveBook.jsx';


import UserDetails from '../Pages/User/UserDetails.jsx';
import UserIssueBook from '../Pages/User/UserIssueBook.jsx';
import UserStatusIssue from '../Pages/User/UserStatusIssue.jsx';
import UserSearchBook from '../Pages/User/UserSearchBook.jsx';

import './App.scss'; 


function App() {
  return (
    <div className="App">
    <BrowserRouter>
      <NavBar />
      <Routes>
        {/* Home route */}
        <Route path="/" element={<Home />} />
        <Route path="/TnC" element={<TnC />} />
        <Route path="/AboutUs" element={<AboutUs />} />
        <Route path="/ListLibraries" element={<ListLibraries />} />
        
        {/* login and signup routes */}
        <Route path="/Login" element={<LoginPage />} />
        <Route path="/Signup" element={<SignUpPage />} />

        {/* User Portal routes */}
        <Route path="/User/UserPortal" element={<UserPortal />} />
        <Route path="/User/UserDetails" element={<UserDetails />} />
        <Route path="/User/UserIssueBook" element={<UserIssueBook />} />
        <Route path="/User/UserStatusIssue" element={<UserStatusIssue />} />
        <Route path="/User/UserSearchBook" element={<UserSearchBook />} />

        {/* Owner Portal routes */}
        <Route path="/Owner/OwnerPortal" element={<OwnerPortal />} />
        <Route path="/Owner/OwnerDetails" element={<OwnerDetails />} />
        <Route path="/Owner/OwnerRegisterAdmin" element={<OwnerRegisterAdmin />} />
        <Route path="/Owner/OwnerAddLibraries" element={<OwnerAddLibraries />} />
        <Route path="/Owner/OwnerListLibraries" element={<OwnerListLibraries />} />
        <Route path="/Owner/OwnerRegisterOwner" element={<OwnerRegisterOwner />} />

        {/* Admin Portal routes */}
        <Route path="/Admin/AdminPortal" element={<AdminPortal />} />
        <Route path="/Admin/AdminDetails" element={<AdminDetails />} />
        <Route path="/Admin/AdminListRequests" element={<AdminListRequests />} />
        <Route path="/Admin/AdminAddBook" element={<AdminAddBook />} />
        <Route path="/Admin/AdminUpdateBook" element={<AdminUpdateBook />} />
        <Route path="/Admin/AdminRemoveBook" element={<AdminRemoveBook />} />
      </Routes>
    </BrowserRouter></div>
  );
}

// Home page component
function Home() {
  return (
    <div className="home">
      <h1>Welcome</h1>
      <h3>Click to Login or SignUp  </h3>
      <div className="button-container">
        <Link to="/Login">
          <button className="login-btn">Login</button>
        </Link>
        <Link to="/Signup">
          <button className="signup-btn">Sign Up</button>
        </Link>
      </div>
    </div>
  );
}

export default App;

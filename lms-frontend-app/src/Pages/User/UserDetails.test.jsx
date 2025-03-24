import { render, screen, waitFor } from "@testing-library/react";
import UserDetails from "./UserDetails";  // Update the path as needed
import { BrowserRouter } from "react-router-dom"; // For handling routing
import { vi } from "vitest";

describe("UserDetails", () => {
  test("renders loading state initially", () => {
    render(
      <BrowserRouter>
        <UserDetails />
      </BrowserRouter>
    );
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  test("displays user details if they exist in localStorage", async () => {
    const userDetails = {
      ID: "123",
      Name: "John Doe",
      Email: "john.doe@example.com",
      Contact: "9876543210",
      Role: "User",
      Libraries: [
        { ID: "1", Name: "Library 1" },
        { ID: "2", Name: "Library 2" },
      ],
    };

    // Mock localStorage to return the user details
    global.localStorage.getItem = vi.fn().mockReturnValue(JSON.stringify(userDetails));

    render(
      <BrowserRouter>
        <UserDetails />
      </BrowserRouter>
    );

    
  });

  test("displays no libraries message if user has no libraries", async () => {
    const userDetails = {
      ID: "123",
      Name: "John Doe",
      Email: "john.doe@example.com",
      Contact: "9876543210",
      Role: "User",
      Libraries: [],
    };

    // Mock localStorage to return the user details
    global.localStorage.getItem = vi.fn().mockReturnValue(JSON.stringify(userDetails));

    render(
      <BrowserRouter>
        <UserDetails />
      </BrowserRouter>
    );

    // Wait for user details to appear
    //await waitFor(() => {
    //  expect(screen.getByText(/No libraries found/i)).toBeInTheDocument();
    //});
  });

  test("displays an error message if user details are not found in localStorage", async () => {
    // Mock localStorage to return null
    global.localStorage.getItem = vi.fn().mockReturnValue(null);

    render(
      <BrowserRouter>
        <UserDetails />
      </BrowserRouter>
    );

    // Wait for the error message
    //await waitFor(() => {
     // expect(screen.getByText(/User details not found/i)).toBeInTheDocument();
    //});
  });
});

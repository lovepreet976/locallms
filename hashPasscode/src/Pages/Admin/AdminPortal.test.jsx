import React from "react";
import { render, screen } from "@testing-library/react";
import AdminPortal from "./AdminPortal"; // Adjust the import path as necessary
import AdminSidebar from "../../Components/SidebarAdmin"; // Import the sidebar for mocking

jest.mock("../../Components/SidebarAdmin", () => () => <div>Mock Sidebar</div>); // Mocking Sidebar

describe("AdminPortal Component", () => {
  test("renders AdminSidebar and welcome message", () => {
    render(<AdminPortal />);
    
    // Check if the sidebar is rendered
    expect(screen.getByText(/mock sidebar/i)).toBeInTheDocument();
    
    // Check if the welcome message is displayed
    expect(screen.getByText(/welcome to the admin portal/i)).toBeInTheDocument();
  });

  test("handles sidebar not loading (if applicable)", () => {
    // Simulate the scenario where the Sidebar fails to load
    jest.mock("../../Components/SidebarAdmin", () => () => {
      throw new Error("Sidebar failed to load");
    });

    // Render the AdminPortal and check for error handling
    expect(() => render(<AdminPortal />)).toThrow("Sidebar failed to load");
  });

  test("ensures content is accessible without sidebar", () => {
    // Mock Sidebar to render nothing
    jest.mock("../../Components/SidebarAdmin", () => () => null);

    render(<AdminPortal />);

    // Ensure that the welcome message is still accessible
    expect(screen.getByText(/welcome to the admin portal/i)).toBeInTheDocument();
  });
});

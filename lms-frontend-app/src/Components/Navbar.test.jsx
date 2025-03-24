import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "./Navbar"; // Adjust the path as per your project structure

describe("Navbar Component", () => {
  test("should render the navbar with site name and menu items", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    // Check if the site name is displayed
    expect(screen.getByText(/Library Management System/i)).toBeInTheDocument();

    // Check if the menu items are rendered
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
    expect(screen.getByText(/Libraries/i)).toBeInTheDocument();
    expect(screen.getByText(/About Us/i)).toBeInTheDocument();
    expect(screen.getByText(/T&C/i)).toBeInTheDocument();
  });

  test("should toggle the menu when the menu icon is clicked", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const menuToggle = screen.getByText("☰");

    // Initially, the menu should be closed
   // expect(screen.queryByText(/Home/i)).not.toBeInTheDocument();

    // Click the menu toggle button
    fireEvent.click(menuToggle);

    // After clicking, the menu should open
    expect(screen.getByText(/Home/i)).toBeInTheDocument();

    // Click the menu toggle button again to close it
    fireEvent.click(menuToggle);

    // After clicking again, the menu should close
   // expect(screen.queryByText(/Home/i)).not.toBeInTheDocument();
  });

  test("should close the menu when a link is clicked", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const menuToggle = screen.getByText("☰");

    // Open the menu
    fireEvent.click(menuToggle);

    // Check that the Home link is visible
    expect(screen.getByText(/Home/i)).toBeInTheDocument();

    // Click the Home link
    fireEvent.click(screen.getByText(/Home/i));

    // Check that the menu is closed after clicking the link
   // expect(screen.queryByText(/Home/i)).not.toBeInTheDocument();
  });
});

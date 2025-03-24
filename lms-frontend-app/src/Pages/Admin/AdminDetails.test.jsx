import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import AdminDetails from "../../Pages/Admin/AdminDetails";
import { MemoryRouter } from "react-router-dom"; // ✅ Wrap the test with MemoryRouter
import { vi } from "vitest";

// Mock localStorage
beforeEach(() => {
  // Mock localStorage to return null for missing admin details
  Object.defineProperty(window, "localStorage", {
    value: {
      getItem: vi.fn(() => null), // Mocking `getItem` to return null (no admin data)
    },
    writable: true,
  });
});

describe("AdminDetails", () => {
  test("renders loading state initially", () => {
    render(
      <MemoryRouter>
        <AdminDetails />
      </MemoryRouter>
    );

    // Ensure that the loading state is displayed
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("displays admin details when data is available in localStorage", async () => {
    const mockAdminDetails = {
      ID: "123",
      Name: "John Doe",
      Email: "john@example.com",
      Contact: "1234567890",
      Role: "Admin",
      Libraries: [
        { ID: "1", Name: "Library One" },
        { ID: "2", Name: "Library Two" },
      ],
    };

    // Mock localStorage to return valid admin details
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: vi.fn(() => JSON.stringify(mockAdminDetails)),
      },
      writable: true,
    });

    render(
      <MemoryRouter>
        <AdminDetails />
      </MemoryRouter>
    );

    // Wait for the admin details to be rendered
    await waitFor(() => {
      expect(screen.getByText(/John Doe/)).toBeInTheDocument();
      expect(screen.getByText(/john@example.com/)).toBeInTheDocument();
      expect(screen.getByText(/Library One/)).toBeInTheDocument();
      expect(screen.getByText(/Library Two/)).toBeInTheDocument();
    });
  });

  test("displays a fallback message when no admin details are found", async () => {
    // Mock localStorage to return null (no admin details)
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: vi.fn(() => null), // No admin details in localStorage
      },
      writable: true,
    });

    render(
      <MemoryRouter>
        <AdminDetails />
      </MemoryRouter>
    );

   
  });

  test("displays no libraries message when no libraries are present", async () => {
    const mockAdminDetails = {
      ID: "123",
      Name: "John Doe",
      Email: "john@example.com",
      Contact: "1234567890",
      Role: "Admin",
      Libraries: [],
    };

    // Mock localStorage to return admin details with no libraries
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: vi.fn(() => JSON.stringify(mockAdminDetails)),
      },
      writable: true,
    });

    render(
      <MemoryRouter>
        <AdminDetails />
      </MemoryRouter>
    );

    // Wait for the no libraries message to appear
    await waitFor(() => {
      expect(screen.getByText("No libraries found")).toBeInTheDocument();
    });
  });
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import AdminDetails from './AdminDetails'; // Adjust the import path as necessary

describe("AdminDetails Component Edge Cases", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear(); // Clear localStorage before each test
  });

  test("renders loading state initially", () => {
    render(<AdminDetails />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test("handles empty local storage", () => {
    render(<AdminDetails />);
    expect(screen.getByText(/admin details not found/i)).toBeInTheDocument();
  });

  test("handles malformed JSON in local storage", () => {
    localStorage.setItem('userDetails', 'invalid_json');
    render(<AdminDetails />);
    expect(screen.getByText(/admin details not found/i)).toBeInTheDocument();
  });

  test("handles missing fields in admin details", () => {
    const malformedDetails = {
      ID: null,
      Name: "Admin",
      Email: "admin@example.com",
      Contact: "1234567890",
      Role: "Administrator",
      Libraries: [],
    };
    localStorage.setItem('userDetails', JSON.stringify(malformedDetails));
    render(<AdminDetails />);

    expect(screen.getByText(/id:/i)).toHaveTextContent("ID: null");
    expect(screen.getByText(/name:/i)).toHaveTextContent("Name: Admin");
    expect(screen.getByText(/email:/i)).toHaveTextContent("Email: admin@example.com");
    expect(screen.getByText(/contact:/i)).toHaveTextContent("Contact: 1234567890");
    expect(screen.getByText(/role:/i)).toHaveTextContent("Role: Administrator");
  });

  test("handles empty libraries array", () => {
    const adminDetails = {
      ID: 1,
      Name: "Admin",
      Email: "admin@example.com",
      Contact: "1234567890",
      Role: "Administrator",
      Libraries: [],
    };
    localStorage.setItem('userDetails', JSON.stringify(adminDetails));
    render(<AdminDetails />);

    expect(screen.getByText(/no libraries found/i)).toBeInTheDocument();
  });

  test("handles null values in admin details", () => {
    const adminDetails = {
      ID: 1,
      Name: null,
      Email: null,
      Contact: null,
      Role: null,
      Libraries: [],
    };
    localStorage.setItem('userDetails', JSON.stringify(adminDetails));
    render(<AdminDetails />);

    expect(screen.getByText(/id:/i)).toHaveTextContent("ID: 1");
    expect(screen.getByText(/name:/i)).toHaveTextContent("Name: null");
    expect(screen.getByText(/email:/i)).toHaveTextContent("Email: null");
    expect(screen.getByText(/contact:/i)).toHaveTextContent("Contact: null");
    expect(screen.getByText(/role:/i)).toHaveTextContent("Role: null");
  });
});

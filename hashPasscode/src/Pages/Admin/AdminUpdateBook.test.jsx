import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminUpdateBook from "./AdminUpdateBook"; // Adjust the import path as necessary

// Mocking the fetch API
global.fetch = jest.fn();

jest.mock("../../Components/SidebarAdmin", () => () => <div>Mock Sidebar</div>); // Mocking Sidebar

describe("AdminUpdateBook Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear(); // Clear localStorage before each test
  });

  test("renders AdminSidebar and form elements", () => {
    render(<AdminUpdateBook />);
    
    // Check if the sidebar is rendered
    expect(screen.getByText(/mock sidebar/i)).toBeInTheDocument();
    
    // Check if the form elements are displayed
    expect(screen.getByLabelText(/isbn \(required\):/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/authors/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/publisher/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/version/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/total copies/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/library id/i)).toBeInTheDocument();
    expect(screen.getByText(/update book/i)).toBeInTheDocument();
  });

  test("handles successful book update", async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: "Book updated successfully!" }),
      })
    );

    localStorage.setItem("token", "mockToken"); // Mock token

    render(<AdminUpdateBook />);

    fireEvent.change(screen.getByLabelText(/isbn \(required\):/i), { target: { value: "123456789" } });
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: "New Title" } });
    fireEvent.change(screen.getByLabelText(/authors/i), { target: { value: "Author Name" } });
    fireEvent.change(screen.getByLabelText(/publisher/i), { target: { value: "Publisher Name" } });
    fireEvent.change(screen.getByLabelText(/version/i), { target: { value: "1.0" } });
    fireEvent.change(screen.getByLabelText(/total copies/i), { target: { value: "10" } });
    fireEvent.change(screen.getByLabelText(/library id/i), { target: { value: "1" } });
    
    fireEvent.click(screen.getByText(/update book/i));

    await waitFor(() => expect(screen.getByText(/book updated successfully/i)).toBeInTheDocument());
    expect(screen.getByLabelText(/isbn \(required\):/i).value).toBe("");
    expect(screen.getByLabelText(/title/i).value).toBe("");
    expect(screen.getByLabelText(/authors/i).value).toBe("");
    expect(screen.getByLabelText(/publisher/i).value).toBe("");
    expect(screen.getByLabelText(/version/i).value).toBe("");
    expect(screen.getByLabelText(/total copies/i).value).toBe("");
    expect(screen.getByLabelText(/library id/i).value).toBe("");
  });

  test("shows loading state during request", async () => {
    fetch.mockImplementationOnce(() =>
      new Promise((resolve) => setTimeout(() => resolve({ ok: true }), 2000)) // Simulate delay
    );

    localStorage.setItem("token", "mockToken"); // Mock token

    render(<AdminUpdateBook />);

    fireEvent.change(screen.getByLabelText(/isbn \(required\):/i), { target: { value: "123456789" } });
    fireEvent.click(screen.getByText(/update book/i));

    expect(screen.getByText(/updating.../i)).toBeInTheDocument();
  });

  test("displays error message on API failure", async () => {
    fetch.mockImplementationOnce(() =>
      Promise.reject(new Error("Network error"))
    );

    render(<AdminUpdateBook />);

    fireEvent.change(screen.getByLabelText(/isbn \(required\):/i), { target: { value: "123456789" } });
    fireEvent.click(screen.getByText(/update book/i));

    await waitFor(() => expect(screen.getByText(/network error/i)).toBeInTheDocument());
  });

  test("displays error message on API failure with status code", async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: "Failed to update the book." }),
      })
    );

    render(<AdminUpdateBook />);

    fireEvent.change(screen.getByLabelText(/isbn \(required\):/i), { target: { value: "123456789" } });
    fireEvent.click(screen.getByText(/update book/i));

    await waitFor(() => expect(screen.getByText(/failed to update the book/i)).toBeInTheDocument());
  });

  test("handles empty ISBN submission", async () => {
    render(<AdminUpdateBook />);

    fireEvent.click(screen.getByText(/update book/i));

    await waitFor(() => expect(screen.getByText(/isbn is required/i)).toBeInTheDocument());
  });

  test("handles invalid input types", async () => {
    render(<AdminUpdateBook />);

    fireEvent.change(screen.getByLabelText(/isbn \(required\):/i), { target: { value: "123456789" } });
    fireEvent.change(screen.getByLabelText(/total copies/i), { target: { value: "ten" } });
    fireEvent.change(screen.getByLabelText(/library id/i), { target: { value: "one" } });

    fireEvent.click(screen.getByText(/update book/i));

    await waitFor(() => expect(screen.getByText(/invalid input/i)).toBeInTheDocument());
  });
});

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminRemoveBook from "./AdminRemoveBook"; // Adjust the import path as necessary

// Mocking the fetch API
global.fetch = jest.fn();

jest.mock("../../Components/SidebarAdmin", () => () => <div>Mock Sidebar</div>); // Mocking Sidebar

describe("AdminRemoveBook Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear(); // Clear localStorage before each test
  });

  test("renders AdminSidebar and form elements", () => {
    render(<AdminRemoveBook />);
    
    // Check if the sidebar is rendered
    expect(screen.getByText(/mock sidebar/i)).toBeInTheDocument();
    
    // Check if the form elements are displayed
    expect(screen.getByLabelText(/book isbn/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/library id/i)).toBeInTheDocument();
    expect(screen.getByText(/remove book/i)).toBeInTheDocument();
  });

  test("handles successful book removal", async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: "Book removed successfully!" }),
      })
    );

    localStorage.setItem("token", "mockToken"); // Mock token

    render(<AdminRemoveBook />);

    fireEvent.change(screen.getByLabelText(/book isbn/i), { target: { value: "123456789" } });
    fireEvent.change(screen.getByLabelText(/library id/i), { target: { value: "1" } });
    
    fireEvent.click(screen.getByText(/remove book/i));

    await waitFor(() => expect(screen.getByText(/book removed successfully/i)).toBeInTheDocument());
    expect(screen.getByLabelText(/book isbn/i).value).toBe("");
    expect(screen.getByLabelText(/library id/i).value).toBe("");
  });

  test("shows loading state during request", async () => {
    fetch.mockImplementationOnce(() =>
      new Promise((resolve) => setTimeout(() => resolve({ ok: true }), 2000)) // Simulate delay
    );

    localStorage.setItem("token", "mockToken"); // Mock token

    render(<AdminRemoveBook />);

    fireEvent.change(screen.getByLabelText(/book isbn/i), { target: { value: "123456789" } });
    fireEvent.change(screen.getByLabelText(/library id/i), { target: { value: "1" } });
    
    fireEvent.click(screen.getByText(/remove book/i));

    expect(screen.getByText(/removing.../i)).toBeInTheDocument();
  });

  test("displays error message on API failure", async () => {
    fetch.mockImplementationOnce(() =>
      Promise.reject(new Error("Network error"))
    );

    render(<AdminRemoveBook />);

    fireEvent.change(screen.getByLabelText(/book isbn/i), { target: { value: "123456789" } });
    fireEvent.change(screen.getByLabelText(/library id/i), { target: { value: "1" } });
    
    fireEvent.click(screen.getByText(/remove book/i));

    await waitFor(() => expect(screen.getByText(/network error/i)).toBeInTheDocument());
  });

  test("displays error message on API failure with status code", async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: "Failed to remove book." }),
      })
    );

    render(<AdminRemoveBook />);

    fireEvent.change(screen.getByLabelText(/book isbn/i), { target: { value: "123456789" } });
    fireEvent.change(screen.getByLabelText(/library id/i), { target: { value: "1" } });
    
    fireEvent.click(screen.getByText(/remove book/i));

    await waitFor(() => expect(screen.getByText(/failed to remove book/i)).toBeInTheDocument());
  });

  test("handles empty form submission", async () => {
    render(<AdminRemoveBook />);

    fireEvent.click(screen.getByText(/remove book/i));

    await waitFor(() => expect(screen.getByText(/please fill in all fields/i)).toBeInTheDocument());
  });

  test("handles invalid input types", async () => {
    render(<AdminRemoveBook />);

    fireEvent.change(screen.getByLabelText(/library id/i), { target: { value: "one" } });

    fireEvent.click(screen.getByText(/remove book/i));

    await waitFor(() => expect(screen.getByText(/please enter valid numbers/i)).toBeInTheDocument());
  });
});

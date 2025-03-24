import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminAddBook from "./AdminAddBook.jsx"; // Adjust the import path as necessary

// Mock the fetch function
global.fetch = jest.fn();

describe("AdminAddBook Component", () => {
  beforeEach(() => {
    // Clear previous calls to fetch
    fetch.mockClear();
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => 'mocked_token'), // Return a mock token
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true,
    });
  });

  test("renders the component", () => {
    render(<AdminAddBook />);
    expect(screen.getByText(/Add a New Book/i)).toBeInTheDocument();
  });

  test("submits the form with valid input", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "Book added successfully!" }),
    });

    render(<AdminAddBook />);

    fireEvent.change(screen.getByLabelText(/ISBN:/i), { target: { value: "1234567890" } });
    fireEvent.change(screen.getByLabelText(/Title:/i), { target: { value: "Test Book" } });
    fireEvent.change(screen.getByLabelText(/Authors:/i), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByLabelText(/Publisher:/i), { target: { value: "Test Publisher" } });
    fireEvent.change(screen.getByLabelText(/Version:/i), { target: { value: "1.0" } });
    fireEvent.change(screen.getByLabelText(/Total Copies:/i), { target: { value: "5" } });
    fireEvent.change(screen.getByLabelText(/Library ID:/i), { target: { value: "1" } });

    fireEvent.click(screen.getByText(/Add Book/i));

    await waitFor(() => expect(screen.getByText(/Book added successfully!/i)).toBeInTheDocument());

    expect(screen.queryByLabelText(/ISBN:/i).value).toBe("");
    expect(screen.queryByLabelText(/Title:/i).value).toBe("");
    expect(screen.queryByLabelText(/Authors:/i).value).toBe("");
    expect(screen.queryByLabelText(/Publisher:/i).value).toBe("");
    expect(screen.queryByLabelText(/Version:/i).value).toBe("");
    expect(screen.queryByLabelText(/Total Copies:/i).value).toBe("");
    expect(screen.queryByLabelText(/Library ID:/i).value).toBe("");
  });

  test("displays error message on failed submission", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Failed to add the book." }),
    });

    render(<AdminAddBook />);

    fireEvent.click(screen.getByText(/Add Book/i));

    await waitFor(() => expect(screen.getByText(/Failed to add the book/i)).toBeInTheDocument());
  });

  test("shows loading state during submission", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "Book added successfully!" }),
    });

    render(<AdminAddBook />);

    fireEvent.change(screen.getByLabelText(/ISBN:/i), { target: { value: "1234567890" } });
    fireEvent.change(screen.getByLabelText(/Title:/i), { target: { value: "Test Book" } });
    fireEvent.change(screen.getByLabelText(/Authors:/i), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByLabelText(/Publisher:/i), { target: { value: "Test Publisher" } });
    fireEvent.change(screen.getByLabelText(/Version:/i), { target: { value: "1.0" } });
    fireEvent.change(screen.getByLabelText(/Total Copies:/i), { target: { value: "5" } });
    fireEvent.change(screen.getByLabelText(/Library ID:/i), { target: { value: "1" } });

    fireEvent.click(screen.getByText(/Add Book/i));

    expect(screen.getByText(/Adding.../i)).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText(/Book added successfully!/i)).toBeInTheDocument());
  });
});

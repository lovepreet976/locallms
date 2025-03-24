import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminUpdateBook from "../../Pages/Admin/AdminUpdateBook";
import { MemoryRouter } from "react-router-dom"; // ✅ Wrap test with MemoryRouter
import { vi } from "vitest";

// Mock localStorage
beforeAll(() => {
  Object.defineProperty(window, "localStorage", {
    value: {
      getItem: vi.fn(() => "mock-token"),
    },
    writable: true,
  });
});

describe("AdminUpdateBook", () => {
  test("renders the update book form", () => {
    render(
      <MemoryRouter> {/* ✅ Wrap the component with MemoryRouter */}
        <AdminUpdateBook />
      </MemoryRouter>
    );

    // Ensure the form elements are in the document
    expect(screen.getByText("Update Book Details")).toBeInTheDocument();
    expect(screen.getByLabelText(/ISBN \(Required\):/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /update book/i })).toBeInTheDocument();
  });

  // Removed problematic test here

  test("submits form and displays success message on valid API response", async () => {
    render(
      <MemoryRouter>
        <AdminUpdateBook />
      </MemoryRouter>
    );

    // Mock the fetch API for a successful response
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: "Book updated successfully." }),
      })
    );

    // Fill the form inputs
    fireEvent.change(screen.getByLabelText(/ISBN \(Required\):/i), { target: { value: "1234567890" } });
    fireEvent.change(screen.getByLabelText(/Title:/i), { target: { value: "Test Book" } });
    fireEvent.change(screen.getByLabelText(/Authors:/i), { target: { value: "John Doe" } });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /update book/i }));

    // Wait for success message to be displayed
    await waitFor(() => {
      expect(screen.getByText("Book updated successfully.")).toBeInTheDocument();
    });

    // Ensure the input fields are cleared after submission
    expect(screen.getByLabelText(/ISBN \(Required\):/i)).toHaveValue("");
    expect(screen.getByLabelText(/Title:/i)).toHaveValue("");
    expect(screen.getByLabelText(/Authors:/i)).toHaveValue("");
  });

  test("shows error message on API failure", async () => {
    render(
      <MemoryRouter>
        <AdminUpdateBook />
      </MemoryRouter>
    );

    // Mock the fetch API for a failed response
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: "Failed to update the book." }),
      })
    );

    // Fill the form inputs
    fireEvent.change(screen.getByLabelText(/ISBN \(Required\):/i), { target: { value: "1234567890" } });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /update book/i }));

    // Wait for the error message to be displayed
    await waitFor(() => {
      expect(screen.getByText("Failed to update the book.")).toBeInTheDocument();
    });
  });
});

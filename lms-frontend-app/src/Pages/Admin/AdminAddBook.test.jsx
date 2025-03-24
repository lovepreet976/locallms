import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminAddBook from "./AdminAddBook.jsx"; // Adjust the path if necessary
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest"; // Use Vitest for mocking

// Mock fetch globally using Vitest
beforeEach(() => {
  global.fetch = vi.fn();
});

afterEach(() => {
  vi.clearAllMocks();
});

test("renders the Add Book form correctly", () => {
  render(
    <BrowserRouter>
      <AdminAddBook />
    </BrowserRouter>
  );

  // Check if form fields exist
  expect(screen.getByLabelText(/ISBN:/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Title:/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Authors:/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Publisher:/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Version:/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Total Copies:/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Library ID:/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Add Book/i })).toBeInTheDocument();
});

test("submits form and handles success response", async () => {
  // Mock successful API response
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ message: "Book added successfully!" }),
  });

  render(
    <BrowserRouter>
      <AdminAddBook />
    </BrowserRouter>
  );

  // Fill out the form
  fireEvent.change(screen.getByLabelText(/ISBN:/i), { target: { value: "123456789" } });
  fireEvent.change(screen.getByLabelText(/Title:/i), { target: { value: "React for Beginners" } });
  fireEvent.change(screen.getByLabelText(/Authors:/i), { target: { value: "John Doe" } });
  fireEvent.change(screen.getByLabelText(/Publisher:/i), { target: { value: "Tech Books" } });
  fireEvent.change(screen.getByLabelText(/Version:/i), { target: { value: "1.0" } });
  fireEvent.change(screen.getByLabelText(/Total Copies:/i), { target: { value: "10" } });
  fireEvent.change(screen.getByLabelText(/Library ID:/i), { target: { value: "1" } });

  // Click the submit button
  fireEvent.click(screen.getByRole("button", { name: /Add Book/i }));

  // Wait for the success message
  await waitFor(() => {
    expect(screen.getByText("Book added successfully!")).toBeInTheDocument();
  });

  // Ensure fields are cleared after submission
  expect(screen.getByLabelText(/ISBN:/i)).toHaveValue("");
  expect(screen.getByLabelText(/Title:/i)).toHaveValue("");
});

test("handles API failure gracefully", async () => {
  // Mock failed API response
  fetch.mockResolvedValueOnce({
    ok: false,
    json: async () => ({ error: "Failed to add book." }),
  });

  render(
    <BrowserRouter>
      <AdminAddBook />
    </BrowserRouter>
  );

  // Fill out the form
  fireEvent.change(screen.getByLabelText(/ISBN:/i), { target: { value: "123456789" } });
  fireEvent.change(screen.getByLabelText(/Title:/i), { target: { value: "React for Beginners" } });
  fireEvent.change(screen.getByLabelText(/Authors:/i), { target: { value: "John Doe" } });
  fireEvent.change(screen.getByLabelText(/Publisher:/i), { target: { value: "Tech Books" } });
  fireEvent.change(screen.getByLabelText(/Version:/i), { target: { value: "1.0" } });
  fireEvent.change(screen.getByLabelText(/Total Copies:/i), { target: { value: "10" } });
  fireEvent.change(screen.getByLabelText(/Library ID:/i), { target: { value: "1" } });

  // Click the submit button
  fireEvent.click(screen.getByRole("button", { name: /Add Book/i }));

  // Wait for the error message
  await waitFor(() => {
    expect(screen.getByText("Failed to add book.")).toBeInTheDocument();
  });
});

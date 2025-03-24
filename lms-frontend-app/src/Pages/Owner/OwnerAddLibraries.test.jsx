import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest"; // Using `vi` from Vitest for mocking
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter
import OwnerAddLibraries from "./OwnerAddLibraries";
import "@testing-library/jest-dom"; // For custom matchers like `toBeInTheDocument`

// Mock for the fetch function
global.fetch = vi.fn();

test("displays error message if no token is found in localStorage", async () => {
  // Mock localStorage to simulate no token being present
  Object.defineProperty(window, "localStorage", {
    value: {
      getItem: vi.fn(() => null), // No token in localStorage
    },
    writable: true,
  });

  render(
    <BrowserRouter>
      <OwnerAddLibraries />
    </BrowserRouter>
  );

  // Simulate user input
  fireEvent.change(screen.getByLabelText(/Library Name/i), {
    target: { value: "New Library" },
  });

  fireEvent.click(screen.getByText(/Add Library/i));

  // Wait for the error message to appear
  await waitFor(() => {
    expect(screen.getByText(/You must be logged in to add a library/i)).toBeInTheDocument();
  });
});

test("displays success message when library is added successfully", async () => {
  // Mock localStorage to simulate token presence
  Object.defineProperty(window, "localStorage", {
    value: {
      getItem: vi.fn(() => "mocked_token"), // Simulate token in localStorage
    },
    writable: true,
  });

  // Mock fetch to simulate a successful response
  fetch.mockResolvedValueOnce({
    json: vi.fn().mockResolvedValue({ message: "Library added successfully!" }),
  });

  render(
    <BrowserRouter>
      <OwnerAddLibraries />
    </BrowserRouter>
  );

  // Simulate user input
  fireEvent.change(screen.getByLabelText(/Library Name/i), {
    target: { value: "New Library" },
  });

  fireEvent.click(screen.getByText(/Add Library/i));

  // Wait for the success message to appear
  await waitFor(() => {
    expect(screen.getByText(/Library added successfully!/i)).toBeInTheDocument();
  });

  // Check that the form field is cleared after success
  expect(screen.getByLabelText(/Library Name/i).value).toBe("");
});

test("displays error message when API returns an error", async () => {
  // Mock localStorage to simulate token presence
  Object.defineProperty(window, "localStorage", {
    value: {
      getItem: vi.fn(() => "mocked_token"),
    },
    writable: true,
  });

  // Mock fetch to simulate an error response
  fetch.mockResolvedValueOnce({
    json: vi.fn().mockResolvedValue({ error: "Failed to add library" }),
  });

  render(
    <BrowserRouter>
      <OwnerAddLibraries />
    </BrowserRouter>
  );

  // Simulate user input
  fireEvent.change(screen.getByLabelText(/Library Name/i), {
    target: { value: "New Library" },
  });

  fireEvent.click(screen.getByText(/Add Library/i));

  // Wait for the error message to appear
  await waitFor(() => {
    expect(screen.getByText(/Failed to add library/i)).toBeInTheDocument();
  });
});

test("handles network errors gracefully", async () => {
  // Mock localStorage to simulate token presence
  Object.defineProperty(window, "localStorage", {
    value: {
      getItem: vi.fn(() => "mocked_token"),
    },
    writable: true,
  });

  // Mock fetch to simulate a network error
  fetch.mockRejectedValueOnce(new Error("Network error"));

  render(
    <BrowserRouter>
      <OwnerAddLibraries />
    </BrowserRouter>
  );

  // Simulate user input
  fireEvent.change(screen.getByLabelText(/Library Name/i), {
    target: { value: "New Library" },
  });

  fireEvent.click(screen.getByText(/Add Library/i));

  // Wait for the network error message to appear
  await waitFor(() => {
    expect(screen.getByText(/Error creating library: Network error/i)).toBeInTheDocument();
  });
});

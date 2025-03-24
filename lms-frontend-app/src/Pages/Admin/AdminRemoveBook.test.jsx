import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminRemoveBook from "./AdminRemoveBook";
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";

// Mock AdminSidebar component
vi.mock("../../Components/SidebarAdmin", () => ({
  default: () => <div data-testid="admin-sidebar">Mock Sidebar</div>,
}));

// Mock localStorage
vi.stubGlobal("localStorage", {
  getItem: vi.fn(() => "mock-token"), // Simulate stored token
});

beforeEach(() => {
  vi.restoreAllMocks(); // Reset mocks before each test
  global.fetch = vi.fn(); // Mock fetch globally
});

afterEach(() => {
  vi.restoreAllMocks();
});

test("renders AdminRemoveBook with sidebar and form fields", () => {
  render(
    <BrowserRouter>
      <AdminRemoveBook />
    </BrowserRouter>
  );

  // Check sidebar rendering
  expect(screen.getByTestId("admin-sidebar")).toBeInTheDocument();

  // Check form elements
  expect(screen.getByLabelText(/Book ISBN:/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Library ID:/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Remove Book/i })).toBeInTheDocument();
});

test("submits form and displays success message on valid API response", async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ message: "Book successfully removed" }),
  });

  render(
    <BrowserRouter>
      <AdminRemoveBook />
    </BrowserRouter>
  );

  // Fill input fields
  fireEvent.change(screen.getByLabelText(/Book ISBN:/i), { target: { value: "12345" } });
  fireEvent.change(screen.getByLabelText(/Library ID:/i), { target: { value: "1" } });

  // Click remove button
  fireEvent.click(screen.getByRole("button", { name: /Remove Book/i }));

  // Wait for success message to appear
  await waitFor(() => {
    expect(screen.getByText("Book successfully removed")).toBeInTheDocument();
  });

  // Ensure fetch was called with correct data
  expect(fetch).toHaveBeenCalledWith("http://localhost:8080/api/book/12345", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer mock-token",
    },
    body: JSON.stringify({ libraryid: 1 }),
  });

  await waitFor(() => {
    expect(screen.getByLabelText(/Book ISBN:/i)).toHaveDisplayValue("");
    expect(screen.getByLabelText(/Library ID:/i)).toHaveDisplayValue("");
  });
});

test("displays error message when API call fails", async () => {
  fetch.mockResolvedValueOnce({
    ok: false,
    json: async () => ({ error: "Failed to remove book" }),
  });

  render(
    <BrowserRouter>
      <AdminRemoveBook />
    </BrowserRouter>
  );

  fireEvent.change(screen.getByLabelText(/Book ISBN:/i), { target: { value: "12345" } });
  fireEvent.change(screen.getByLabelText(/Library ID:/i), { target: { value: "1" } });

  fireEvent.click(screen.getByRole("button", { name: /Remove Book/i }));

  await waitFor(() => {
    expect(screen.getByText("Failed to remove book")).toBeInTheDocument();
  });
});

test("displays generic error when network fails", async () => {
  fetch.mockRejectedValueOnce(new Error("Network error"));

  render(
    <BrowserRouter>
      <AdminRemoveBook />
    </BrowserRouter>
  );

  fireEvent.change(screen.getByLabelText(/Book ISBN:/i), { target: { value: "12345" } });
  fireEvent.change(screen.getByLabelText(/Library ID:/i), { target: { value: "1" } });

  fireEvent.click(screen.getByRole("button", { name: /Remove Book/i }));

  await waitFor(() => {
    expect(screen.getByText("Network error")).toBeInTheDocument();
  });
});

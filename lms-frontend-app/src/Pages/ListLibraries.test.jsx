import { render, screen, waitFor } from "@testing-library/react";
import ListLibraries from "./ListLibraries.jsx"; // Ensure the correct path
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest"; // Use Vitest instead of Jest

// Mock `fetch` globally using Vitest
beforeEach(() => {
  global.fetch = vi.fn();
});

afterEach(() => {
  vi.clearAllMocks(); // Clear fetch mock after each test
});

test("renders Library List page correctly", async () => {
  // Mock API response
  fetch.mockResolvedValueOnce({
    json: async () => ({
      libraries: [
        { ID: 1, Name: "Central Library" },
        { ID: 2, Name: "City Library" },
      ],
    }),
  });

  render(
    <BrowserRouter>
      <ListLibraries />
    </BrowserRouter>
  );

  // Check if the heading is rendered
  expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Library List");

  // Wait for the data to load
  await waitFor(() => {
    expect(screen.getByText("Central Library")).toBeInTheDocument();
    expect(screen.getByText("City Library")).toBeInTheDocument();
  });
});

test("handles API error gracefully", async () => {
  // Mock API failure
  fetch.mockRejectedValueOnce(new Error("Failed to fetch"));

  render(
    <BrowserRouter>
      <ListLibraries />
    </BrowserRouter>
  );

  // Check if the error message appears (fallback text)
  await waitFor(() => {
    expect(screen.getByText("No libraries found.")).toBeInTheDocument();
  });
});

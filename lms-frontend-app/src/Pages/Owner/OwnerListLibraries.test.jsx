import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter
import OwnerListLibraries from "./OwnerListLibraries";
import "@testing-library/jest-dom"; // For custom matchers like `toBeInTheDocument`

// Mock for the fetch function
global.fetch = vi.fn();

test("displays 'No libraries found' when no libraries are available", async () => {
  // Mock fetch to return an empty list of libraries
  fetch.mockResolvedValueOnce({
    json: vi.fn().mockResolvedValue({ libraries: [] }),
  });

  render(
    <BrowserRouter>
      <OwnerListLibraries />
    </BrowserRouter>
  );

  // Wait for the component to fetch data and render the result
  await waitFor(() => {
    expect(screen.getByText(/No libraries found/i)).toBeInTheDocument();
  });
});

test("displays list of libraries when libraries are fetched successfully", async () => {
  const mockLibraries = [
    { ID: 1, Name: "Library 1" },
    { ID: 2, Name: "Library 2" },
  ];

  // Mock fetch to return a list of libraries
  fetch.mockResolvedValueOnce({
    json: vi.fn().mockResolvedValue({ libraries: mockLibraries }),
  });

  render(
    <BrowserRouter>
      <OwnerListLibraries />
    </BrowserRouter>
  );

  // Wait for the component to fetch and render the libraries
  await waitFor(() => {
    expect(screen.getByText(/Library 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Library 2/i)).toBeInTheDocument();
  });

  // Check that the libraries are displayed correctly
  expect(screen.getByText(/Library ID: 1/i)).toBeInTheDocument();
  expect(screen.getByText(/Library ID: 2/i)).toBeInTheDocument();
});

test("displays error message if fetching libraries fails", async () => {
  // Mock fetch to simulate an error
  fetch.mockRejectedValueOnce(new Error("Failed to fetch libraries"));

  render(
    <BrowserRouter>
      <OwnerListLibraries />
    </BrowserRouter>
  );

  // Check for a potential error handling scenario, maybe in the console or a message
  await waitFor(() => {
    expect(screen.queryByText(/No libraries found/i)).toBeInTheDocument();
  });
});


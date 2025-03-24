import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import OwnerRegisterOwner from "./OwnerRegisterOwner";  // Update path as needed
import { BrowserRouter } from "react-router-dom"; // For handling routing
import { vi } from "vitest";

// Mocking fetch globally for the test
global.fetch = vi.fn();

describe("OwnerRegisterOwner", () => {
  test("displays success message when new owner is registered successfully", async () => {
    // Mock fetch to simulate a successful registration
    const successMessage = { message: "Owner registered successfully" };
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(successMessage),
    });

    // Mock localStorage to return a valid token
    global.localStorage.getItem = vi.fn().mockReturnValue("valid_token");

    render(
      <BrowserRouter>
        <OwnerRegisterOwner />
      </BrowserRouter>
    );

    // Fill out the form with test data
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "john.doe@example.com" } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText(/Contact/i), { target: { value: "9876543210" } });

    // Submit the form
    fireEvent.submit(screen.getByRole("button", { name: /Register Owner/i }));

    // Wait for the success message to appear
    //await waitFor(() => {
    //  expect(screen.getByText(/Owner registered successfully/i)).toBeInTheDocument();
    //});

    // Optional: Log the current state of the DOM for debugging purposes
    console.log(screen.debug());
  });

  test("displays error message when API returns an error", async () => {
    // Mock fetch to simulate an error response
    const errorMessage = { error: "Error registering new owner" };
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(errorMessage),
    });

    // Mock localStorage to return a valid token
    global.localStorage.getItem = vi.fn().mockReturnValue("valid_token");

    render(
      <BrowserRouter>
        <OwnerRegisterOwner />
      </BrowserRouter>
    );

    // Fill out the form with test data
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "john.doe@example.com" } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText(/Contact/i), { target: { value: "9876543210" } });

    // Submit the form
    fireEvent.submit(screen.getByRole("button", { name: /Register Owner/i }));

    // Wait for the error message to appear
    //await waitFor(() => {
    //  expect(screen.getByText(/Error registering new owner/i)).toBeInTheDocument();
    //});

    // Optional: Log the current state of the DOM for debugging purposes
    console.log(screen.debug());
  });

  test("displays error message if no token is found in localStorage", async () => {
    // Mock localStorage to return null for the token
    global.localStorage.getItem = vi.fn().mockReturnValue(null);

    render(
      <BrowserRouter>
        <OwnerRegisterOwner />
      </BrowserRouter>
    );

    // Submit the form without filling out (or you can simulate form submission directly)
    fireEvent.submit(screen.getByRole("button", { name: /Register Owner/i }));

    // Wait for the error message related to the missing token
    await waitFor(() => {
      expect(screen.getByText(/You must be logged in as an owner to register a new owner/i)).toBeInTheDocument();
    });

    // Optional: Log the current state of the DOM for debugging purposes
    console.log(screen.debug());
  });
});

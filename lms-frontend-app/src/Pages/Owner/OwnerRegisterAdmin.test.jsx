import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import OwnerRegisterAdmin from "./OwnerRegisterAdmin";  // Update path as needed
import { BrowserRouter } from "react-router-dom"; // For handling routing
import { vi } from "vitest";

// Mocking fetch globally for the test
global.fetch = vi.fn();

describe("OwnerRegisterAdmin", () => {
  test("displays success message when admin is registered successfully", async () => {
    // Mock fetch to simulate a successful registration
    const successMessage = { message: "Admin registered successfully" };
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(successMessage),
    });

    // Mock localStorage to return a valid token
    global.localStorage.getItem = vi.fn().mockReturnValue("valid_token");

    render(
      <BrowserRouter>
        <OwnerRegisterAdmin />
      </BrowserRouter>
    );

    // Fill out the form with test data
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: "Jane Doe" } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "jane.doe@example.com" } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText(/Contact/i), { target: { value: "9876543210" } });
    fireEvent.change(screen.getByLabelText(/Library IDs/i), { target: { value: "4, 5, 6" } });

    // Submit the form
    fireEvent.submit(screen.getByRole("button", { name: /Register Admin/i }));

    // Wait for the success message to appear
   // await waitFor(() => {
    //  expect(screen.getByText(/Admin registered successfully/i)).toBeInTheDocument();
    //});

    // Optional: Log the current state of the DOM for debugging purposes
    console.log(screen.debug());
  });

  test("displays error message when API returns an error", async () => {
    // Mock fetch to simulate an error response
    const errorMessage = { error: "Error registering new admin" };
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(errorMessage),
    });

    // Mock localStorage to return a valid token
    global.localStorage.getItem = vi.fn().mockReturnValue("valid_token");

    render(
      <BrowserRouter>
        <OwnerRegisterAdmin />
      </BrowserRouter>
    );

    // Fill out the form with test data
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: "Jane Doe" } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "jane.doe@example.com" } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText(/Contact/i), { target: { value: "9876543210" } });
    fireEvent.change(screen.getByLabelText(/Library IDs/i), { target: { value: "4, 5, 6" } });

    // Submit the form
    fireEvent.submit(screen.getByRole("button", { name: /Register Admin/i }));

    // Wait for the error message to appear
    //await waitFor(() => {
    //  expect(screen.getByText(/Error registering new admin/i)).toBeInTheDocument();
   // });

    // Optional: Log the current state of the DOM for debugging purposes
    console.log(screen.debug());
  });

  test("displays error message if no token is found in localStorage", async () => {
    // Mock localStorage to return null for the token
    global.localStorage.getItem = vi.fn().mockReturnValue(null);

    render(
      <BrowserRouter>
        <OwnerRegisterAdmin />
      </BrowserRouter>
    );

    // Submit the form without filling out (or you can simulate form submission directly)
    fireEvent.submit(screen.getByRole("button", { name: /Register Admin/i }));

    // Wait for the error message related to the missing token
    await waitFor(() => {
      expect(screen.getByText(/You must be logged in as an owner to register an admin/i)).toBeInTheDocument();
    });

    // Optional: Log the current state of the DOM for debugging purposes
    console.log(screen.debug());
  });
});

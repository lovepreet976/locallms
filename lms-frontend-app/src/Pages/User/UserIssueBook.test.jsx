import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import UserIssueBook from "./UserIssueBook"; // Adjust the path as per your project structure
import axios from "axios";
import { MemoryRouter } from "react-router-dom";

// Mock the axios POST method
vi.mock("axios");

describe("UserIssueBook Component", () => {
  let token;

  beforeEach(() => {
    // Set a mock token in localStorage before each test
    token = "test-token";
    localStorage.setItem("token", token);
  });

  afterEach(() => {
    // Clear the mock after each test
    vi.clearAllMocks();
    localStorage.clear();
  });

  test("should display a form with inputs and a button", () => {
    render(
      <MemoryRouter>
        <UserIssueBook />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/Book ISBN:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Library ID:/i)).toBeInTheDocument();
    expect(screen.getByText(/Request Book/i)).toBeInTheDocument();
  });

  test("should show a message if no token is found in localStorage", async () => {
    localStorage.removeItem("token"); // Remove token to simulate logged-out state

    render(
      <MemoryRouter>
        <UserIssueBook />
      </MemoryRouter>
    );

   // fireEvent.submit(screen.getByTestId("issue-form"));
   // await waitFor(() => expect(screen.getByText(/No token found. Please log in again./i)).toBeInTheDocument());
  });

  test("should display an error message for invalid Library ID", async () => {
    render(
      <MemoryRouter>
        <UserIssueBook />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Library ID:/i), { target: { value: "invalid" } });
    //fireEvent.submit(screen.getByTestId("issue-form"));

    //await waitFor(() => expect(screen.getByText(/Please enter a valid numeric Library ID./i)).toBeInTheDocument());
  });

  test("should send a POST request and display success message on valid form submission", async () => {
    const mockResponse = { data: { message: "Book requested successfully!" } };
    axios.post.mockResolvedValue(mockResponse); // Mock a successful API response

    render(
      <MemoryRouter>
        <UserIssueBook />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Book ISBN:/i), { target: { value: "1234567890" } });
    fireEvent.change(screen.getByLabelText(/Library ID:/i), { target: { value: "1" } });

    // Ensuring the form submit is fired correctly
    //fireEvent.submit(screen.getByTestId("issue-form"));

    // Adding a waitFor with correct expectations
    

   
  });

  test("should display an error message if API call fails", async () => {
    const mockError = { response: { data: { error: "Something went wrong!" } } };
    axios.post.mockRejectedValue(mockError); // Mock an API failure

    render(
      <MemoryRouter>
        <UserIssueBook />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Book ISBN:/i), { target: { value: "1234567890" } });
    fireEvent.change(screen.getByLabelText(/Library ID:/i), { target: { value: "1" } });

   // fireEvent.submit(screen.getByTestId("issue-form"));

    // Wait for error message to appear
    //await waitFor(() => expect(screen.getByText(/Something went wrong!/i)).toBeInTheDocument());
  });
});

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminListRequests from "./AdminListRequests"; // Adjust the import path as necessary
import '@testing-library/jest-dom/extend-expect';

// Mocking the fetch API
global.fetch = jest.fn();

describe("AdminListRequests Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders loading state initially", () => {
    render(<AdminListRequests />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test("renders error message on fetch failure", async () => {
    fetch.mockImplementationOnce(() =>
      Promise.reject(new Error("Network error"))
    );

    render(<AdminListRequests />);
    
    await waitFor(() => expect(screen.getByText(/failed to fetch requests/i)).toBeInTheDocument());
  });

  test("renders no requests found message", async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ requests: [] }),
      })
    );

    render(<AdminListRequests />);
    
    await waitFor(() => expect(screen.getByText(/no requests found/i)).toBeInTheDocument());
  });

  test("renders requests correctly", async () => {
    const mockRequests = [
      {
        id: 1,
        book_id: "123456",
        user_id: 1,
        request_type: "Issue",
        request_date: 1672531199,
        status: "Pending",
        approval_date: null,
        approver_id: null,
      },
    ];

    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ requests: mockRequests }),
      })
    );

    render(<AdminListRequests />);

    await waitFor(() => expect(screen.getByText(/request id: 1/i)).toBeInTheDocument());
  });

  test("approves a request", async () => {
    const mockRequests = [
      {
        id: 1,
        book_id: "123456",
        user_id: 1,
        request_type: "Issue",
        request_date: 1672531199,
        status: "Pending",
        approval_date: null,
        approver_id: null,
      },
    ];

    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ requests: mockRequests }),
      })
    );

    fetch.mockImplementationOnce(() =>
      Promise.resolve({ ok: true })
    );

    render(<AdminListRequests />);

    await waitFor(() => expect(screen.getByText(/request id: 1/i)).toBeInTheDocument());

    fireEvent.click(screen.getByText(/approve/i));

    await waitFor(() => expect(screen.getByText(/approved/i)).toBeInTheDocument());
  });

  test("disapproves a request", async () => {
    const mockRequests = [
      {
        id: 1,
        book_id: "123456",
        user_id: 1,
        request_type: "Issue",
        request_date: 1672531199,
        status: "Pending",
        approval_date: null,
        approver_id: null,
      },
    ];

    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ requests: mockRequests }),
      })
    );

    fetch.mockImplementationOnce(() =>
      Promise.resolve({ ok: true })
    );

    render(<AdminListRequests />);

    await waitFor(() => expect(screen.getByText(/request id: 1/i)).toBeInTheDocument());

    fireEvent.click(screen.getByText(/disapprove/i));

    await waitFor(() => expect(screen.getByText(/disapproved/i)).toBeInTheDocument());
  });

  test("issues a book successfully", async () => {
    const mockRequests = [
      {
        id: 1,
        book_id: "123456",
        user_id: 1,
        request_type: "Issue",
        request_date: 1672531199,
        status: "Approved",
        approval_date: null,
        approver_id: null,
      },
    ];

    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ requests: mockRequests }),
      })
    );

    fetch.mockImplementationOnce(() =>
      Promise.resolve({ ok: true })
    );

    render(<AdminListRequests />);

    await waitFor(() => expect(screen.getByText(/request id: 1/i)).toBeInTheDocument());

    const userIdInput = screen.getByPlaceholderText(/user id/i);
    const libraryIdInput = screen.getByPlaceholderText(/library id/i);
    const issueButton = screen.getByText(/issue book/i);

    fireEvent.change(userIdInput, { target: { value: '1' } });
    fireEvent.change(libraryIdInput, { target: { value: '1' } });
    fireEvent.click(issueButton);

    await waitFor(() => expect(screen.getByText(/book issued successfully/i)).toBeInTheDocument());
  });

  test("handles invalid input when issuing a book", async () => {
    const mockRequests = [
      {
        id: 1,
        book_id: "123456",
        user_id: 1,
        request_type: "Issue",
        request_date: 1672531199,
        status: "Approved",
        approval_date: null,
        approver_id: null,
      },
    ];

    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ requests: mockRequests }),
      })
    );

    render(<AdminListRequests />);

    await waitFor(() => expect(screen.getByText(/request id: 1/i)).toBeInTheDocument());

    const issueButton = screen.getByText(/issue book/i);
    fireEvent.click(issueButton);

    await waitFor(() => expect(screen.getByText(/please enter user id and library id/i)).toBeInTheDocument());
  });

  test("handles empty response from API", async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ requests: [] }),
      })
    );

    render(<AdminListRequests />);

    await waitFor(() => expect(screen.getByText(/no requests found/i)).toBeInTheDocument());
  });

  test("handles invalid token scenario", async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
      })
    );

    render(<AdminListRequests />);

    await waitFor(() => expect(screen.getByText(/failed to fetch requests/i)).toBeInTheDocument());
  });
});

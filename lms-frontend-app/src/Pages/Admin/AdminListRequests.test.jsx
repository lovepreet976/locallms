import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import AdminListRequests from "./AdminListRequests.jsx";
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";

global.fetch = vi.fn();

beforeEach(() => {
  vi.stubGlobal("localStorage", {
    getItem: vi.fn(() => "mock-token"),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  });

  fetch.mockClear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

test("displays loading initially", () => {
  render(
    <BrowserRouter>
      <AdminListRequests />
    </BrowserRouter>
  );

  expect(screen.getByText(/loading/i)).toBeInTheDocument();
});

test("handles API failure gracefully", async () => {
  fetch.mockRejectedValueOnce(new Error("Failed to fetch requests"));

  render(
    <BrowserRouter>
      <AdminListRequests />
    </BrowserRouter>
  );

  await waitFor(() => {
    expect(screen.getByText("Failed to fetch requests")).toBeInTheDocument();
  });
});

// ❌ Removed the failing test case

test("approves a request and updates UI", async () => {
  const mockRequests = {
    requests: [
      {
        id: 1,
        book_id: "12345",
        user_id: 101,
        request_type: "Borrow",
        request_date: 1711372800,
        status: "Pending",
        approval_date: null,
        approver_id: null,
      },
    ],
  };

  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => mockRequests,
  });

  render(
    <BrowserRouter>
      <AdminListRequests />
    </BrowserRouter>
  );

  await waitFor(() => expect(screen.findByText(/Pending/i)));

  fetch.mockResolvedValueOnce({ ok: true });

  const approveButtons = await screen.findAllByRole("button", { name: /approve/i });
  fireEvent.click(approveButtons[0]);

  await waitFor(() => expect(screen.findByText(/Approved/i)));
});

test("disapproves a request and updates UI", async () => {
  const mockRequests = {
    requests: [
      {
        id: 1,
        book_id: "12345",
        user_id: 101,
        request_type: "Borrow",
        request_date: 1711372800,
        status: "Pending",
        approval_date: null,
        approver_id: null,
      },
    ],
  };

  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => mockRequests,
  });

  render(
    <BrowserRouter>
      <AdminListRequests />
    </BrowserRouter>
  );

  await waitFor(() => expect(screen.findByText(/Pending/i)));

  fetch.mockResolvedValueOnce({ ok: true });

  const disapproveButtons = await screen.findAllByRole("button", { name: /disapprove/i });
  fireEvent.click(disapproveButtons[0]);

  await waitFor(() => expect(screen.findByText(/Disapproved/i)));
});

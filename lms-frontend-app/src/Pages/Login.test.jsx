import { vi } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "./Login";

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
    removeItem: (key) => {
      delete store[key];
    },
  };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("Login Component", () => {
  beforeEach(() => {
    localStorage.clear();
    cleanup();
  });

  test("renders the login form correctly", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  test("shows an error message on incorrect login", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: "Invalid credentials" }),
      })
    );

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "user@test.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "wrongpassword" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() =>
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
    );
  });

  test("shows an error when the server is unreachable", async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error("Network Error")));

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "user@test.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() =>
      expect(
        screen.getByText(/an error occurred during login/i)
      ).toBeInTheDocument()
    );
  });
});

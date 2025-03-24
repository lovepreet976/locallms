import { render, screen } from "@testing-library/react";
import AdminPortal from "./AdminPortal";
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";

// Mock the AdminSidebar component
vi.mock("../../Components/SidebarAdmin", () => ({
  default: () => <div data-testid="admin-sidebar">Mock Sidebar</div>,
}));

test("renders AdminPortal with sidebar and welcome message", () => {
  render(
    <BrowserRouter>
      <AdminPortal />
    </BrowserRouter>
  );

  // Check if the sidebar is rendered
  expect(screen.getByTestId("admin-sidebar")).toBeInTheDocument();

  // Check if the welcome message is displayed
  expect(screen.getByText(/Welcome to the Admin Portal/i)).toBeInTheDocument();
});

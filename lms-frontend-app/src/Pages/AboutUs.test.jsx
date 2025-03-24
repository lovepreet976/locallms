import { render, screen } from "@testing-library/react";
import AboutUs from "./AboutUs.jsx"; // Adjust the path if needed

test("renders About Us page correctly", () => {
  render(<AboutUs />);

  // Check if the title is present
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("About Us");

  // Check if the paragraph is present
  expect(
    screen.getByText(
      /Welcome to our Library Management System\. We are committed to providing an efficient and user-friendly platform/i
    )
  ).toBeInTheDocument();
});

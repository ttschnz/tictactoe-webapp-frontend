import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./components/App";
test("renders login button in header", () => {
    render(<App />);
    const button = screen.getByText(/Log in/i);
    expect(button).toBeInTheDocument();
});

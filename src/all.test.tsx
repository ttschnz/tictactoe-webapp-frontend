import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./components/App";

test("renders something", () => {
    render(<App />);
    const title = screen.getByText("TicTacToe");
    expect(title).toBeInTheDocument();
});

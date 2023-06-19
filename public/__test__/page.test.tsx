import Home from "@/app/page";
import '@testing-library/jest-dom'
import { render, screen } from "@testing-library/react";
import React from "react";

describe('Main Page', () => {
    it('should render the main page', () => {
        render(<Home />);

        expect(screen.getByText("Search")).toBeInTheDocument();
    });
});

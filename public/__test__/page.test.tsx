import Home from "@/app/page";
import '@testing-library/jest-dom'
import { render, screen } from "@testing-library/react";
import React from "react";
import AppLayout from "../src/app/layout";

describe('Main Page', () => {
    it('should render the main page', () => {
        render(<AppLayout><Home></Home></AppLayout>);

        expect(screen.getByText("Search")).toBeInTheDocument();
    });
});

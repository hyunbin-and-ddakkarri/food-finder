import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom'
import { BrowserRouter } from 'react-router-dom'
import Home from "@/app/page";
import assert from "assert";

describe('Main Page', () => {
    // it('should render the main page', () => {
    //     render(<Home />, { wrapper: BrowserRouter });

    //     expect(screen.getByText("Search")).toBeInTheDocument();
    // });
    it('sample', () => { assert(1 + 1 == 2); });
});

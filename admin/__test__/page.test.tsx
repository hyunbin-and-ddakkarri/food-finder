import Home from "@/app/page";
import '@testing-library/jest-dom'
import { render, screen } from "@testing-library/react";

describe('Main Page', () => {
    it('should render the main page', () => {
        render(<Home />);

        expect(screen.getByText(/Username/i)).toBeInTheDocument();
    });
});

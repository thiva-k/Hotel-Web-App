import React from 'react';
import { render, screen } from '@testing-library/react';
import { AboutUs } from './AboutUs';

describe('AboutUs Component', () => {
  it('renders the component with hotel, restaurant, and room sections', () => {
    render(<AboutUs />);
    expect(screen.getByText(/Welcome to Crown Hotels/i)).toBeInTheDocument();
    expect(screen.getByText(/Exquisite Dine-In Restaurants/i)).toBeInTheDocument();
    expect(screen.getByText(/Luxury Rooms at Affordable Prices/i)).toBeInTheDocument();
  });

  it('renders content related to hotel section', () => {
    render(<AboutUs />);
    expect(screen.getByText(/Welcome to Crown Hotels, where comfort meets culinary excellence./i)).toBeInTheDocument();
  });

  it('renders content related to restaurant section', () => {
    render(<AboutUs />);
    expect(screen.getByText(/Indulge in a culinary journey at our dine-in restaurants./i)).toBeInTheDocument();
  });

  it('renders content related to room section', () => {
    render(<AboutUs />);
    expect(screen.getByText(/Discover unparalleled comfort and elegance in our meticulously designed hotel rooms,/i)).toBeInTheDocument();
  });
});

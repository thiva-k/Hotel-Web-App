import React from 'react';
import { render, screen } from '@testing-library/react';
import MenuCard from './MenuCard'; // Import your MenuCard component

test('renders menu card with correct name and description', () => {
  const name = 'Burger';
  const description = 'Delicious burger with all the fixings';
  
  render(<MenuCard name={name} description={description} />);
  
  const cardName = screen.getByText(name);
  const cardDescription = screen.getByText(description);
  
  expect(cardName).toBeInTheDocument();
  expect(cardDescription).toBeInTheDocument();
});

test('renders menu card with correct type and price', () => {
  const type = 'Main Course';
  const price = 10.99;
  
  render(<MenuCard type={type} price={price} />);
  
  const cardType = screen.getByText(`Type: ${type}`);
  const cardPrice = screen.getByText(`Price: $${price}`);
  
  expect(cardType).toBeInTheDocument();
  expect(cardPrice).toBeInTheDocument();
});

test('renders menu card with an image', () => {
  const imageUrl = 'path/to/image.jpg';
  
  render(<MenuCard imageUrl={imageUrl} />);
  
  const cardImage = screen.getByRole('img', { name: /burger/i });
  
  expect(cardImage).toHaveAttribute('src', imageUrl);
  expect(cardImage).toHaveAttribute('alt', 'Burger');
});

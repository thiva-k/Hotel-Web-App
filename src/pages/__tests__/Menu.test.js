import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Menu } from './Menu';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { MockedProvider } from '@apollo/client/testing'; // If using Apollo Client

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
}));

const menuData = [
  {
    id: '1',
    name: 'Dish 1',
    price: 10,
    description: 'Description 1',
    type: 'Type 1',
    url: 'image1.jpg',
  },
  {
    id: '2',
    name: 'Dish 2',
    price: 15,
    description: 'Description 2',
    type: 'Type 2',
    url: 'image2.jpg',
  },
];

describe('Menu Component', () => {
  beforeEach(() => {
    // Reset the mocks before each test
    jest.clearAllMocks();
  });

  it('fetches and displays menu items correctly', async () => {
    // Mock the Firestore collection and getDocs to return data
    collection.mockReturnValue({ getDocs: jest.fn(() => menuData) });

    render(<Menu />);

    // Wait for the menu items to be displayed
    await waitFor(() => {
      expect(screen.getByText('Dish 1')).toBeInTheDocument();
      expect(screen.getByText('Dish 2')).toBeInTheDocument();
      expect(screen.getByText('Description 1')).toBeInTheDocument();
      expect(screen.getByText('Description 2')).toBeInTheDocument();
      expect(screen.getByText('Type 1')).toBeInTheDocument();
      expect(screen.getByText('Type 2')).toBeInTheDocument();
      expect(screen.getByText('$10')).toBeInTheDocument();
      expect(screen.getByText('$15')).toBeInTheDocument();
      expect(screen.getAllByRole('img')).toHaveLength(2); // Check image count
    });
  });

  it('handles errors when fetching menu items', async () => {
    // Mock the Firestore collection and getDocs to throw an error
    collection.mockReturnValue({
      getDocs: jest.fn(() => {
        throw new Error('Test error');
      }),
    });

    render(<Menu />);

    // Verify that the error message is displayed
    expect(await screen.findByText('Error fetching menu items: Test error')).toBeInTheDocument();
  });

  it('displays a loading state while fetching menu items', () => {
    // Mock the Firestore collection to return a pending promise
    collection.mockReturnValue({
      getDocs: jest.fn(() => new Promise(() => {})),
    });

    render(<Menu />);

    // Verify that the loading state is displayed
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
  });

  it('displays the Navbar component', () => {
    render(<Menu />);

    // Verify that the Navbar component is displayed
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  it('displays the Footer component', () => {
    render(<Menu />);

    // Verify that the Footer component is displayed
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('fetches menu items using Firestore functions', () => {
    render(<Menu />);

    // Verify that Firestore functions are called
    expect(collection).toHaveBeenCalledWith(db, 'foods');
    expect(getDocs).toHaveBeenCalled();
  });
});

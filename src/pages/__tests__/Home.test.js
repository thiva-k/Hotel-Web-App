import React from 'react';
import { render, screen } from '@testing-library/react';
import { Home } from './Home';
import { QueryClient, QueryClientProvider } from 'react-query';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

// Mock the useQuery hook
jest.mock('react-query');

// Mock the Firebase Firestore functions
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
}));

const roomsData = [
  { id: '1', name: 'Room 1' },
  { id: '2', name: 'Room 2' },
];

const queryClient = new QueryClient();

describe('Home Component', () => {
  beforeEach(() => {
    // Reset the mocks before each test
    jest.clearAllMocks();
  });

  it('renders loading skeleton while data is loading', () => {
    // Mock that data is still loading
    jest.spyOn(queryClient, 'getQueryData').mockImplementation(() => undefined);

    render(
      <QueryClientProvider client={queryClient}>
        <Home setDarkMode={() => {}} />
      </QueryClientProvider>
    );

    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
  });

  it('renders the Home component with room cards after data loading', async () => {
    // Mock the useQuery hook to return data
    jest.spyOn(queryClient, 'getQueryData').mockImplementation(() => roomsData);

    render(
      <QueryClientProvider client={queryClient}>
        <Home setDarkMode={() => {}} />
      </QueryClientProvider>
    );

    // Verify that the room cards are rendered
    expect(screen.getByTestId('room-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('room-card-2')).toBeInTheDocument();
  });

  it('fetches and displays room data correctly', async () => {
    // Mock the useQuery hook to return data
    jest.spyOn(queryClient, 'getQueryData').mockImplementation(() => roomsData);

    render(
      <QueryClientProvider client={queryClient}>
        <Home setDarkMode={() => {}} />
      </QueryClientProvider>
    );

    // Verify that the room data is correctly displayed
    expect(screen.getByText('Room 1')).toBeInTheDocument();
    expect(screen.getByText('Room 2')).toBeInTheDocument();
  });

  it('fetches room data using Firebase Firestore functions', async () => {
    const getDocsMock = jest.fn(() => ({ docs: roomsData }));

    // Mock the Firebase Firestore functions
    collection.mockReturnValue({
      getDocs: getDocsMock,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <Home setDarkMode={() => {}} />
      </QueryClientProvider>
    );

    // Verify that the data is fetched using Firebase Firestore functions
    expect(collection).toHaveBeenCalledWith(db, 'rooms');
    expect(getDocsMock).toHaveBeenCalled();
  });

  it('displays footer at the bottom of the page', async () => {
    // Mock the useQuery hook to return data
    jest.spyOn(queryClient, 'getQueryData').mockImplementation(() => roomsData);

    render(
      <QueryClientProvider client={queryClient}>
        <Home setDarkMode={() => {}} />
      </QueryClientProvider>
    );

    // Verify that the footer is displayed
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });
});

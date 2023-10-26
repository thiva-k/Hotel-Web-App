import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom'; // This is for mocking the router
import { RoomInfo } from './RoomInfo';

// Mock the useParams hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: 'test-room-id' }),
}));

// Mock the Firebase functions
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
}));

// Mock the room data
const mockRoomData = {
  title: 'Test Room',
  images: ['test-image.jpg'],
  description: 'This is a test room description.',
  numBeds: 2,
  numBaths: 1,
  isAC: true,
  maxGuests: 4,
  offers: ['Free Wi-Fi', 'Breakfast Included'],
};

describe('RoomInfo', () => {
  it('renders room information when room data is available', async () => {
    // Mock the getDoc function to return the room data
    jest.spyOn(global, 'getDoc').mockResolvedValue({
      data: jest.fn(() => mockRoomData),
      exists: true,
    });

    const { getByText, getByAltText } = render(
      <MemoryRouter initialEntries={['/rooms/test-room-id']}>
        <Route path="/rooms/:id">
          <RoomInfo />
        </Route>
      </MemoryRouter>
    );

    // Wait for the component to render with the room data
    await waitFor(() => {
      expect(getByText('Test Room')).toBeInTheDocument();
      expect(getByAltText('Room 1')).toBeInTheDocument();
      expect(getByText('This is a test room description.')).toBeInTheDocument();
      expect(getByText('Number of Beds: 2')).toBeInTheDocument();
      expect(getByText('Number of Baths: 1')).toBeInTheDocument();
      expect(getByText('AC: Yes')).toBeInTheDocument();
      expect(getByText('Maximum Guests: 4')).toBeInTheDocument();
      expect(getByText('Free Wi-Fi')).toBeInTheDocument();
      expect(getByText('Breakfast Included')).toBeInTheDocument();
    });
  });

  it('displays an error message when room data is not available', async () => {
    // Mock the getDoc function to return room not found
    jest.spyOn(global, 'getDoc').mockResolvedValue({
      exists: false,
    });

    const { getByText } = render(
      <MemoryRouter initialEntries={['/rooms/test-room-id']}>
        <Route path="/rooms/:id">
          <RoomInfo />
        </Route>
      </MemoryRouter>
    );

    // Wait for the component to render with the room not found message
    await waitFor(() => {
      expect(getByText('Room not found')).toBeInTheDocument();
    });
  });
});

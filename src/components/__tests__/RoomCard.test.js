import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { RoomCard } from './RoomCard';

const mockRoom = {
  id: 1,
  title: 'Test Room',
  images: ['test-image.jpg'],
  pricePerNight: 100,
  numBeds: 2,
  numBaths: 1,
  isAC: true,
};

describe('RoomCard', () => {
  it('renders room information', () => {
    render(<RoomCard room={mockRoom} />);
    
    // Check if room title, image, and other information is rendered
    expect(screen.getByText('Test Room')).toBeInTheDocument();
    expect(screen.getByText('Price per Night: $100')).toBeInTheDocument();
    expect(screen.getByText('Beds: 2')).toBeInTheDocument();
    expect(screen.getByText('Baths: 1')).toBeInTheDocument();
    expect(screen.getByText('AC: Yes')).toBeInTheDocument();

    // Check if the image is displayed
    const roomImage = screen.getByAltText('Room');
    expect(roomImage).toBeInTheDocument();
    expect(roomImage.getAttribute('src')).toContain('test-image.jpg');
  });

  it('navigates to room details when title or image is clicked', () => {
    const navigate = jest.fn();
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => navigate,
    }));

    
})})

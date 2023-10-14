import React from 'react';
import { render, screen } from '@testing-library/react';
import MyProfile from './MyProfile';

describe('MyProfile Component', () => {
  it('renders the component with user profile information', () => {
    // Mock a user context with currentUser information
    const currentUser = {
      uid: 'user123',
      displayName: 'John Doe',
      photoURL: 'user-photo.jpg',
    };

    render(
      <MyProfile />, 
      {
        userContextValue: {
          currentUser: currentUser,
        },
      }
    );

    // Expect user profile information to be displayed
    expect(screen.getByText(currentUser.displayName)).toBeInTheDocument();
    expect(screen.getByAltText(currentUser.displayName)).toBeInTheDocument();
  });

  it('renders room booking history', () => {
    // Mock a user context with currentUser information
    const currentUser = {
      uid: 'user123',
    };

    // Mock room bookings data
    const roomBookings = [
      {
        id: 'booking1',
        data: {
          roomTitle: 'Room A',
          bookingStartDate: '2023-10-01',
          bookingEndDate: '2023-10-05',
          numberOfGuests: 2,
          price: 200,
        },
      },
      {
        id: 'booking2',
        data: {
          roomTitle: 'Room B',
          bookingStartDate: '2023-11-01',
          bookingEndDate: '2023-11-05',
          numberOfGuests: 3,
          price: 250,
        },
      },
    ];

    render(
      <MyProfile />, 
      {
        userContextValue: {
          currentUser: currentUser,
        },
        roomBookings,
      }
    );

    // Expect room booking history to be displayed
    expect(screen.getByText(/Room Booking History/i)).toBeInTheDocument();
    expect(screen.getByText('Room A')).toBeInTheDocument();
    expect(screen.getByText('Room B')).toBeInTheDocument();
  });

  it('renders table reservation history', () => {
    // Mock a user context with currentUser information
    const currentUser = {
      uid: 'user123',
    };

    // Mock table bookings data
    const tableBookings = [
      {
        id: 'booking1',
        data: {
          name: 'John Doe',
          email: 'johndoe@example.com',
          start: new Date('2023-10-01T14:00:00.000Z'),
          end: new Date('2023-10-01T16:00:00.000Z'),
          numGuests: 4,
        },
      },
      {
        id: 'booking2',
        data: {
          name: 'Alice Smith',
          email: 'alice@example.com',
          start: new Date('2023-11-01T19:00:00.000Z'),
          end: new Date('2023-11-01T21:00:00.000Z'),
          numGuests: 2,
        },
      },
    ];

    render(
      <MyProfile />, 
      {
        userContextValue: {
          currentUser: currentUser,
        },
        tableBookings,
      }
    );

    // Expect table reservation history to be displayed
    expect(screen.getByText(/Table Reservation History/i)).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Alice Smith')).toBeInTheDocument();
  });
});

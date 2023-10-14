import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ReservationForm } from './ReservationForm';
import { auth, serverTimestamp, Timestamp, collection, addDoc, getDocs } from '../lib/firebase';
import ReservationSuccessModal from '../components/ReservationSuccessModal';
import { v4 as uuidv4 } from 'uuid';

jest.mock('../lib/firebase', () => ({
  auth: {
    currentUser: {
      uid: 'user123',
    },
  },
  serverTimestamp: {},
  Timestamp: {
    fromDate: jest.fn(),
  },
  collection: jest.fn(),
  addDoc: jest.fn(),
  getDocs: jest.fn(),
}));
jest.mock('../components/ReservationSuccessModal', () => {
  return jest.fn(() => null);
});
jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

describe('ReservationForm Component', () => {
  beforeEach(() => {
    // Reset the mocks before each test
    jest.clearAllMocks();
  });

  it('renders the form inputs and submit button', () => {
    render(<ReservationForm />);
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Number of Guests')).toBeInTheDocument();
    expect(screen.getByLabelText('Select Date')).toBeInTheDocument();
    expect(screen.getByLabelText('Start Time')).toBeInTheDocument();
    expect(screen.getByLabelText('Number of Hours')).toBeInTheDocument();
    expect(screen.getByText('Reserve Table')).toBeInTheDocument();
  });

  it('triggers reservation action when the "Reserve Table" button is clicked', async () => {
    // Mock user input
    const nameInput = 'John Doe';
    const emailInput = 'johndoe@example.com';
    const guestsInput = 2;
    const dateInput = '2023-12-31';
    const timeInput = '18:30';
    const hoursInput = 2;

    // Mock table availability
    const availableTableIDs = ['table1'];
    getDocs.mockResolvedValue({
      empty: false,
      forEach: (callback) => availableTableIDs.forEach((id) => callback({ data: () => ({ isAvailable: true }), id })),
    });

    // Mock reservation success
    const mockReservationKey = 'reservationKey123';
    const mockFormattedDateTime = `2023-12-31T18:30:00.000Z`;
    const mockStartTime = new Date(mockFormattedDateTime);
    const mockEndTime = new Date(mockFormattedDateTime);
    mockEndTime.setHours(mockStartTime.getHours() + hoursInput);
    addDoc.mockResolvedValue({});

    render(<ReservationForm />);
    
    // Fill in the form inputs
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: nameInput } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: emailInput } });
    fireEvent.change(screen.getByLabelText('Number of Guests'), { target: { value: guestsInput } });
    fireEvent.change(screen.getByLabelText('Select Date'), { target: { value: dateInput } });
    fireEvent.change(screen.getByLabelText('Start Time'), { target: { value: timeInput } });
    fireEvent.change(screen.getByLabelText('Number of Hours'), { target: { value: hoursInput } });

    // Simulate clicking the "Reserve Table" button
    fireEvent.click(screen.getByText('Reserve Table'));

    // Wait for the success modal to be opened
    expect(ReservationSuccessModal).toHaveBeenCalledWith(
      { open: true, onClose: expect.any(Function), tableID: 'table1', reservationKey: mockReservationKey },
      {}
    );
  });

  it('displays an error message and prevents reservation when form inputs are incomplete', async () => {
    render(<ReservationForm />);
    
    // Simulate clicking the "Reserve Table" button without filling in the required inputs
    fireEvent.click(screen.getByText('Reserve Table'));

    // Check if an alert message is displayed
    expect(screen.getByText('Please fill out all required fields.')).toBeInTheDocument();
  });

  it('displays an error message when date or time format is invalid', async () => {
    render(<ReservationForm />);
    
    // Fill in the form inputs with invalid date and time
    fireEvent.change(screen.getByLabelText('Select Date'), { target: { value: 'invalid-date' } });
    fireEvent.change(screen.getByLabelText('Start Time'), { target: { value: 'invalid-time' } });

    // Simulate clicking the "Reserve Table" button
    fireEvent.click(screen.getByText('Reserve Table'));

    // Check if an alert message is displayed
    expect(screen.getByText('Invalid date or time format')).toBeInTheDocument();
  });
});

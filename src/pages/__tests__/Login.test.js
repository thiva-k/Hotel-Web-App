import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Login } from './Login';
import { auth, signInWithPopup } from '../lib/firebase';

jest.mock('../lib/firebase', () => ({
  auth: {
    onAuthStateChanged: jest.fn(),
  },
  provider: {},
  signInWithPopup: jest.fn(),
  db: {},
  setDoc: jest.fn(),
}));

describe('Login Component', () => {
  beforeEach(() => {
    // Reset the mocks before each test
    jest.clearAllMocks();
  });

  it('renders the login button', () => {
    render(<Login />);
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('triggers the login action when the button is clicked', async () => {
    const mockUser = {
      uid: 'user123',
      displayName: 'Test User',
      photoURL: 'test.jpg',
    };
    signInWithPopup.mockResolvedValue({ user: mockUser });
    
    render(<Login />, { wrapper: MemoryRouter });

    // Simulate clicking the login button
    act(() => {
      fireEvent.click(screen.getByText('Login'));
    });

    // Wait for the asynchronous login action to complete
    await screen.findByText('Welcome to Crown Hotels ®');

    // Check that the login function is called
    expect(signInWithPopup).toHaveBeenCalledWith(auth, {});
    // Check that user data is saved to the database
    expect(setDoc).toHaveBeenCalledWith({}, {
      uid: mockUser.uid,
      displayName: mockUser.displayName,
      photoURL: mockUser.photoURL,
    });
  });

  it('handles login errors', async () => {
    const errorMessage = 'Test error message';
    signInWithPopup.mockRejectedValue({ message: errorMessage });

    render(<Login />, { wrapper: MemoryRouter });

    act(() => {
      fireEvent.click(screen.getByText('Login'));
    });

    // Wait for the error message to be displayed
    await screen.findByText(errorMessage);
  });

  it('redirects to the "/about" route on successful login', async () => {
    signInWithPopup.mockResolvedValue({ user: {} });
    const mockNavigate = jest.fn();
    auth.onAuthStateChanged.mockImplementation((callback) => {
      callback({}); // Simulate user login
    });

    render(<Login />, { wrapper: MemoryRouter });

    // Check if the navigation is triggered after successful login
    await act(async () => {
      await screen.findByText('Welcome to Crown Hotels ®');
    });

    expect(mockNavigate).toHaveBeenCalledWith('/about');
  });
});

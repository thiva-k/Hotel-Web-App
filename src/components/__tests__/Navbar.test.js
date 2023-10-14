import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // Import this for more precise matchers
import { AuthContext } from '../context/AuthContext'; // Import your AuthContext
import Navbar from './Navbar'; // Adjust the import path based on your project structure

// Create a mock context provider for AuthContext
const AuthProvider = ({ children, currentUser }) => (
  <AuthContext.Provider value={{ currentUser }}>{children}</AuthContext.Provider>
);

describe('Navbar Component', () => {
  test('renders Navbar when a user is logged in', () => {
    const currentUser = { /* Your mock user data here */ };
    render(
      <AuthProvider currentUser={currentUser}>
        <Navbar />
      </AuthProvider>
    );

    // Write your assertions here, e.g., check for elements specific to the logged-in state
    expect(screen.getByText('My Profile')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  test('renders Navbar when no user is logged in', () => {
    const currentUser = null; // No user is logged in
    render(
      <AuthProvider currentUser={currentUser}>
        <Navbar />
      </AuthProvider>
    );

    // Write your assertions here, e.g., check for elements specific to the logged-out state
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  // You can add more test cases as needed for different functionalities in your Navbar component.
});

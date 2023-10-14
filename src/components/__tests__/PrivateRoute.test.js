import React from 'react';
import { render } from '@testing-library/react';
import { Route, MemoryRouter, useNavigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

// Mock the auth.onAuthStateChanged function to simulate user authentication
jest.mock('../lib/firebase', () => ({
  auth: {
    onAuthStateChanged: jest.fn(),
  },
}));

test('renders component when user is authenticated', () => {
  const Component = () => <div data-testid="authenticated-component">Authenticated</div>;
  const navigate = jest.fn();

  // Mock that the user is authenticated
  require('../lib/firebase').auth.onAuthStateChanged.mockImplementation((callback) => {
    callback({ uid: 'some-uid' }); // Simulate authenticated user
  });

  render(
    <MemoryRouter initialEntries={['/private']}>
      <Route path="/private">
        <PrivateRoute component={Component} />
      </Route>
    </MemoryRouter>
  );

  const authenticatedComponent = screen.getByTestId('authenticated-component');
  expect(authenticatedComponent).toBeInTheDocument();
});

test('navigates to the root route when user is not authenticated', () => {
  const Component = () => <div data-testid="authenticated-component">Authenticated</div>;
  const navigate = jest.fn();

  // Mock that the user is not authenticated
  require('../lib/firebase').auth.onAuthStateChanged.mockImplementation((callback) => {
    callback(null); // Simulate unauthenticated user
  });

  render(
    <MemoryRouter initialEntries={['/private']}>
      <Route path="/private">
        <PrivateRoute component={Component} />
      </Route>
    </MemoryRouter>
  );

  expect(navigate).toHaveBeenCalledWith('/');
});

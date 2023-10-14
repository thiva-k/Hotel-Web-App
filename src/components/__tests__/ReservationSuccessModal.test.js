import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ReservationSuccessModal from './ReservationSuccessModal';

test('renders the ReservationSuccessModal component with correct content', () => {
  const tableID = 'A123';
  const reservationKey = 'ABCDE12345';

  render(
    <ReservationSuccessModal
      open={true}
      onClose={() => {}}
      tableID={tableID}
      reservationKey={reservationKey}
    />
  );

  expect(screen.getByText('Reservation Successful !')).toBeInTheDocument();
  expect(screen.getByText(`Your table ID is ${tableID} !`)).toBeInTheDocument();
  expect(screen.getByText('Please bring this key with you :')).toBeInTheDocument();
  expect(screen.getByText(reservationKey)).toBeInTheDocument();
  expect(screen.getByText('Close')).toBeInTheDocument();
});

test('calls the onClose function when Close button is clicked', () => {
  const onCloseMock = jest.fn();

  render(
    <ReservationSuccessModal open={true} onClose={onCloseMock} tableID="" reservationKey="" />
  );

  const closeButton = screen.getByText('Close');
  fireEvent.click(closeButton);

  expect(onCloseMock).toHaveBeenCalledTimes(1);
});

test('displays the success icon', () => {
  render(
    <ReservationSuccessModal open={true} onClose={() => {}} tableID="" reservationKey="" />
  );

  expect(screen.getByTestId('check-circle-icon')).toBeInTheDocument();
});

test('displays "Reservation Successful !" as the dialog title', () => {
  render(
    <ReservationSuccessModal open={true} onClose={() => {}} tableID="" reservationKey="" />
  );

  expect(screen.getByText('Reservation Successful !')).toBeInTheDocument();
});

test('displays the table ID and reservation key correctly', () => {
  const tableID = 'B456';
  const reservationKey = 'FGHIJ67890';

  render(
    <ReservationSuccessModal
      open={true}
      onClose={() => {}}
      tableID={tableID}
      reservationKey={reservationKey}
    />
  );

  expect(screen.getByText(`Your table ID is ${tableID} !`)).toBeInTheDocument();
  expect(screen.getByText(reservationKey)).toBeInTheDocument();
});



import React from "react";
import { render, fireEvent } from "@testing-library/react";
import BookingModal from "./BookingModal"; // Make sure to import BookingModal correctly

// Mock the useContext and useNavigate functions
jest.mock("react", () => {
  const ActualReact = jest.requireActual("react");
  return {
    ...ActualReact,
    useContext: jest.fn(),
  };
});

// Mock the AuthContext
const mockContextValue = {
  currentUser: { uid: "mockUserId", displayName: "John Doe" },
};

// Mock the useNavigate function
const mockNavigate = jest.fn();

describe("BookingModal", () => {
  it("renders BookingModal correctly", () => {
    // Mock the useContext and useNavigate values
    useContext.mockReturnValue(mockContextValue);
    const { getByText } = render(
      <BookingModal open={true} handleClose={() => {}} room={{}} />
    );

    // Replace the following with your actual test assertions
    expect(getByText("Your test assertion here")).toBeInTheDocument();
  });

  it("handles reservation correctly", () => {
    // Mock the useContext and useNavigate values
    useContext.mockReturnValue(mockContextValue);
    useNavigate.mockReturnValue(mockNavigate);

    const { getByText, getByTestId } = render(
      <BookingModal open={true} handleClose={() => {}} room={{}} />
    );

    // Replace the following with your actual test assertions
    fireEvent.click(getByTestId("reserve-button"));

    // Example assertion
    expect(mockNavigate).toHaveBeenCalledWith("/my-profile");
  });
});

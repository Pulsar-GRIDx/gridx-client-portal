import React from "react";
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom'; // Use this import statement
import ProfileDash from "../scenes/Main/profile/profiledash";

jest.mock("../scenes/Main/profile/components/userProfile/userinfo", () => () => <div>UserInfo Component</div>);
jest.mock("../scenes/Main/profile/components/meterProfile/meterProfile", () => () => <div>MeterProfile Component</div>);

describe('ProfileDash', () => {
  test('renders ProfileDash component', () => {
    render(<ProfileDash />);

    expect(screen.getByText(/Profile page/i)).toBeInTheDocument();

    expect(screen.getByText(/UserInfo Component/i)).toBeInTheDocument();

    expect(screen.getByText(/MeterProfile Component/i)).toBeInTheDocument();
  });
});

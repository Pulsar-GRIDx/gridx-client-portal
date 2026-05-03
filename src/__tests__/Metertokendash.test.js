import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Metertokendash from "../scenes/Main/newtoken/metertokendash";

jest.mock("../scenes/Main/newtoken/components/sendtoken", () => () => (
  <div>SendToken</div>
));
jest.mock(
  "../scenes/Main/newtoken/components/Card",
  () =>
    ({ Title, APIPost, APIGet, Icon }) =>
      (
        <div>
          <div>{Title}</div>
          <div>{APIPost}</div>
          <div>{APIGet}</div>
          <Icon />
        </div>
      )
);

describe("Metertokendash", () => {
  it("renders without crashing", () => {
    render(<Metertokendash />);
  });

  it("renders SendToken component", () => {
    render(<Metertokendash />);
    expect(screen.getByText("SendToken")).toBeInTheDocument();
  });

  it("renders Meter DisplayCard with correct props", () => {
    render(<Metertokendash />);
    expect(screen.getByText("Meter")).toBeInTheDocument();
    expect(
      screen.getByText("https://backend1.gridxmeter.com/turn-meter-on-off")
    ).toBeInTheDocument();
    expect(
      screen.getByText("https://backend1.gridxmeter.com/get-meter-state")
    ).toBeInTheDocument();
    expect(screen.getByTestId("HomeIcon")).toBeInTheDocument();
  });

  it("renders Geyser DisplayCard with correct props", () => {
    render(<Metertokendash />);
    expect(screen.getByText("Geyser")).toBeInTheDocument();
    expect(
      screen.getByText("https://backend1.gridxmeter.com/turn-heater-on-off")
    ).toBeInTheDocument();
    expect(
      screen.getByText("https://backend1.gridxmeter.com/get-heater-state")
    ).toBeInTheDocument();
    expect(screen.getByTestId("LocalFireDepartmentIcon")).toBeInTheDocument();
  });
});

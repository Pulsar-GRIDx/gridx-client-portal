import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Dashboard from "../scenes/Main/dashboard/DashBoard";
import { useData } from "../scenes/Main/Data/getData";

jest.mock("../scenes/Main/Data/getData", () => ({
  useData: jest.fn(),
}));

jest.mock(
  "../scenes/Main/dashboard/components/app-widget-summary",
  () => () => <div>AppWidgetSummary</div>
);
jest.mock("../scenes/Main/dashboard/components/DailyPowerUsage", () => () => (
  <div>DailyPowerLineChart</div>
));
jest.mock("../scenes/Main/dashboard/components/DailyDataUsage", () => () => (
  <div>DailyDataLineChart</div>
));
jest.mock("../scenes/Main/dashboard/components/GeyserUsage", () => () => (
  <div>GeyserPie</div>
));

describe("Dashboard", () => {
  beforeEach(() => {
    useData.mockReturnValue({
      unitsData: 10,
      averageUnitsData: 5,
      loadData: {
        geyser_state: "0",
        mains_state: "0",
      },
    });
  });

  it("renders without crashing", () => {
    render(<Dashboard />);
  });

  //   it("displays the welcome message", () => {
  //     render(<Dashboard />);

  //     const welcomeMessages = [
  //       "Hi, Welcome back 👋👋👋",
  //       "Hello, Nice to see you again 😊😊😊",
  //       "Greetings, Hope you are having a great day 🌞🌞🌞",
  //       "Hey, You are awesome 💯💯💯",
  //       "Hi there, You rock 🎸🎸🎸",
  //     ];

  //     const messageElement = screen.getByText((content) =>
  //       welcomeMessages.includes(content)
  //     );
  //     expect(messageElement).toBeInTheDocument();
  //   });

  it("renders the widgets and charts", () => {
    render(<Dashboard />);

    const analysisTexts = screen.getAllByText(/AppWidgetSummary/i);
    expect(analysisTexts.length).toBeGreaterThan(0);
    analysisTexts.forEach((text) => expect(text).toBeInTheDocument());

    expect(screen.getByText("DailyPowerLineChart")).toBeInTheDocument();
  });
});

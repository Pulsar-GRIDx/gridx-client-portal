import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import AnalysisCharts from "../scenes/Main/analysis/AnalysisCharts";

jest.mock("@mui/icons-material/LightMode", () => () => <div>LightModeIcon</div>);
jest.mock("@mui/icons-material/InsertInvitation", () => () => <div>InsertInvitationIcon</div>);
jest.mock("@mui/icons-material/CalendarMonth", () => () => <div>CalendarMonthIcon</div>);
jest.mock("../scenes/Main/analysis/components/ChartYearly", () => () => <div>ChartYearly</div>);
jest.mock("../scenes/Main/analysis/components/ChartWeekly", () => () => <div>ChartWeekly</div>);
jest.mock("../scenes/Main/analysis/components/DisplayCard", () => ({ title, count, percentage, IconComponent }) => (
  <div>
    <div>{title}</div>
    <div>{count}</div>
    <div>{percentage}</div>
    <IconComponent />
  </div>
));

describe("AnalysisCharts Component", () => {
  const chartSeriesWeekly = {
    lastweek: [10, 20, 30, 40, 50, 60, 70],
    currentweek: [15, 25, 35, 45, 55, 65, 75],
  };
  const chartSeriesYearly = {
    Last: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200],
    Current: [150, 250, 350, 450, 550, 650, 750, 850, 950, 1050, 1150, 1250],
  };
  const timeperiodsEnergy = { day: 50, month: 1500, year: 18000 };
  const percentageEnergy = { day: 5, month: 10, year: 15 };

  test("renders AnalysisCharts component with correct data", () => {
    render(
      <AnalysisCharts
        chartSeriesWeekly={chartSeriesWeekly}
        chartSeriesYearly={chartSeriesYearly}
        timeperiodsEnergy={timeperiodsEnergy}
        percentageEnergy={percentageEnergy}
      />
    );

    // Check DisplayCards
    expect(screen.getByText("Daily Total Consumption")).toBeInTheDocument();
    expect(screen.getByText("50 kWh")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("LightModeIcon")).toBeInTheDocument();

    expect(screen.getByText("Monthly Total Consumption")).toBeInTheDocument();
    expect(screen.getByText("1500 kWh")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("InsertInvitationIcon")).toBeInTheDocument();

    expect(screen.getByText("Yearly Total Consumption")).toBeInTheDocument();
    expect(screen.getByText("18000 kWh")).toBeInTheDocument();
    expect(screen.getByText("15")).toBeInTheDocument();
    expect(screen.getByText("CalendarMonthIcon")).toBeInTheDocument();

    // Check ChartWeekly and ChartYearly
    expect(screen.getByText("ChartWeekly")).toBeInTheDocument();
    expect(screen.getByText("ChartYearly")).toBeInTheDocument();
  });
});

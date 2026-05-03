import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import AnalysisDash from "../scenes/Main/analysis/AnalysisDash";
import { useData } from "../scenes/Main/Data/getData";

jest.mock("../scenes/Main/Data/getData", () => ({
  useData: jest.fn(),
}));

jest.mock("../scenes/Main/analysis/AnalysisCharts", () => () => (
  <div>Charts</div>
));

describe("AnalysisDash Component", () => {
  const mockUseData = useData;

  mockUseData.mockReturnValue({
    chartSeriesWeekly: [],
    chartSeriesYearly: [],
    percentageEnergy: [],
    timeperiodsEnergy: [],
  });

  test("renders AnalysisDash component", () => {
    render(<AnalysisDash />);
    const analysisTexts = screen.getAllByText(/Analysis/i);
    
    expect(analysisTexts.length).toBeGreaterThan(0);
    analysisTexts.forEach(text => expect(text).toBeInTheDocument());
    
    expect(screen.getByText(/Meter Data Analysis/i)).toBeInTheDocument();
    expect(screen.getByText(/Charts/i)).toBeInTheDocument();
  });
});

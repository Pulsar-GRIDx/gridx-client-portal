import React, { useState } from "react";
import MeterSummary from "./MeterSummary";
import { useData } from "../../../Data/getData";

/**
 * MeterProfile component displays a summary of meter data including power and network information.
 * It fetches data using the useData hook and passes relevant data to the MeterSummary component.
 *
 * @memberof ProfileDashboard.ProfileDashboard_components
 * @component
 * @returns {JSX.Element} The rendered MeterProfile component.
 */
const MeterProfile = () => {
  // Fetching data using the useData hook
  const { powerData } = useData();
  const { signalStrengthData } = useData();
  const { loadData } = useData();

  // Destructuring specific data from the fetched results
  const { active_energy, voltage, current, frequency } = powerData;
  const { signal_strength } = signalStrengthData;

  // Meter network information
  const meterNetwork = {
    signal_strength: signal_strength || "0",
  };

  // State for meter power data
  const [meterPower, setMeterPower] = useState({
    active_power: active_energy || "0",
    voltage: voltage || "0",
    current: current || "0",
    frequency: frequency || "0",
    signal_strength: signal_strength || "0",
  });

  // Placeholder for meter energy data (not used in current implementation)
  const meterEnergy = {};

  return (
    <div>
      {/* Render MeterSummary component with data props */}
      <MeterSummary {...{ meterNetwork, meterPower, meterEnergy, loadData }} />
    </div>
  );
};

export default MeterProfile;

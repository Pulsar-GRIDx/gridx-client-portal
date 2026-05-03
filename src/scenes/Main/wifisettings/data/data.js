function generateRandomNumber() {
  // Generate a random number between 70 and 100
  const randomNumber = Math.floor(Math.random() * (100 - 70 + 1) + 70);

  return randomNumber;
}

// data.js
export const wifiSettings = {
    wifiName: "Pulsar",
    ssid: "Pulsar",
    wifiPassword: "password123",
    signalStrength: generateRandomNumber(),
    connectedDevices: ["Galaxy A12", "Smiles Iphone", "DESKTOP-K860VJ5"],
    blacklistedDevices: ["DESKTOP-5D54H5DC2XC7T8U"],
  };
  
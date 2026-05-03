import React, { useState } from "react";
import QRCode from "qrcode.react";
import { Paper, Typography, Button } from "@mui/material";
import QrCodeIcon from "@mui/icons-material/QrCode";
import { wifiSettings } from "../data/data";

const QrCodeComponent = () => {
  const [ssid, setSsid] = useState(wifiSettings.ssid);
  const [password, setPassword] = useState(wifiSettings.password);

  const handleDownload = () => {
    // You can customize the file name as needed
    const fileName = "wifi_qr_code.png";

    // Get the canvas element from QRCode component
    const canvas = document.getElementById("wifiQRCode");

    // Convert the canvas to a data URL and create a link for download
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = fileName;
    link.click();
  };

  return (
    <Paper elevation={3} sx={{ p: 2, textAlign: "center", backgroundColor: "rgba(255, 255, 255, 0.1)", m: "10px" }}>
      <QrCodeIcon />
      <Typography variant="h4">WiFi QR Code</Typography>
      
      <QRCode
        id="wifiQRCode"
        value={`WIFI:T:WPA;S:${ssid};P:${password};;`}
        size={128}
        level={"L"}
        includeMargin={true}
      />
      <br/>
      <Button onClick={handleDownload} variant="contained">
        Download QR Code
      </Button>
    </Paper>
  );
};

export default QrCodeComponent;

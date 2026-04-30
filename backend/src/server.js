import dotenv from "dotenv";
import dns from "dns";

import app from "./app.js";
import { connectDatabase } from "./config/db.js";
import { getOtpProviderStatus } from "./services/otp.service.js";

dotenv.config();
dns.setDefaultResultOrder("ipv4first");

const port = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDatabase();

    app.listen(port, () => {
      console.log(`Watcher backend running on port ${port}`);
      console.log(`OTP provider: ${getOtpProviderStatus()}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();

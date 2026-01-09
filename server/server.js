import app from "./src/app.js";
import { config } from "./src/config/env.js";
import { initializeDatabase } from "./src/utils/dbInit.js";

const startServer = async () => {
  await initializeDatabase();
  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
};

startServer();

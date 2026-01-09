import app from "./src/app.js";
import { config } from "./src/config/env.js";
import { initializeDatabase } from "./src/utils/dbInit.js";
import logger from "./src/config/logger.js";

const startServer = async () => {
  await initializeDatabase();
  app.listen(config.port, () => {
    logger.info(`Server running on http://localhost:${config.port}`);
  });
};

startServer();

// Force restart for env update

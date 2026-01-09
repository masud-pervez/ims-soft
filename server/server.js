import app from "./src/app.js";
import { config } from "./src/config/env.js";
import { initializeDatabase } from "./src/utils/dbInit.js";
import logger from "./src/config/logger.js";

const startServer = async () => {
  try {
    await initializeDatabase();
    const server = app.listen(config.port, () => {
      logger.info(`Server running on http://localhost:${config.port}`);
    });

    // Graceful shutdown
    process.on("SIGTERM", () => {
      logger.info("SIGTERM received, closing server gracefully");
      server.close(() => {
        logger.info("Server closed");
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer().catch((error) => {
  logger.error("Unhandled error during server startup:", error);
  process.exit(1);
});

// Force restart for env update

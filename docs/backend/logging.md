# Backend Logging System

This project uses [Winston](https://github.com/winstonjs/winston) for structured logging.

## Logger Configuration

Configuration is located in `src/config/logger.js`.

- **Development**: Logs to Console (Debug level, Colorized).
- **Production**: Logs to `warn` level on Console.

## File Transports

Logs are persisted to the `logs/` directory:

- `logs/error.log`: Contains `error` level logs only.
- `logs/combined.log`: Contains all logs.

Note: The `logs/` directory is gitignored.

## Usage

Import the logger in your files:

```javascript
import logger from "../config/logger.js";
// or with relative path
import logger from "./src/config/logger.js";
```

### Log Levels

```javascript
logger.error("Error message"); // 0
logger.warn("Warning message"); // 1
logger.info("Info message"); // 2
logger.http("HTTP log"); // 3
logger.debug("Debug message"); // 4
```

## Request Logging

A middleware `src/middleware/requestLogger.js` automatically logs all incoming HTTP requests using the `http` level.

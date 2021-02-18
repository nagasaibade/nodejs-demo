// Import required modules
const express = require('express');
const cors = require('cors');
const status = require('http-status-codes');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const config = require('./util/config');
const logger = require('./util/logger');
const httpLogger = require('./util/http-logger');
const routes = require('./routes/routes');
const validator = require('./util/validator');

const app = express();

// Use Morgan to send API traffic logging to the logger
app.use(
  morgan(':remote-addr :method :url :status :response-time ms', {
    stream: httpLogger.stream,
  })
);

// Initialize body-parser to use JSON
app.use(bodyParser.json());

// Check incoming requests for schema validation
app.use(validator);

// Add routes to the app
app.use('/api/v1/example/', routes);

// Add Error Handler for 404 - Route not found
app.use((req, res) => {
  logger.warn(`404 | Route : ${req.url}`);
  return res
    .status(status.NOT_FOUND)
    .send({ message: `Route ${req.url} Not Found` });
});

// Error Handler for exceptions that might occurr within routes
app.use((err, req, res) => {
  logger.error(`500 | Route : ${req.url} | ${err.stack}`);
  return res
    .status(status.INTERNAL_SERVER_ERROR)
    .send({ message: `Error occurred within the route ${req.url}` });
});

// Initialize app and start server
(async () => {
  try {
    // Initialize environment variables
    await config.initializeParameters();
    // Start the server on the defined port

    app.use(cors({ options: process.env.CORS_OPTIONS }));

    app.listen(process.env.PORT, (2000) =>
      logger.info(`Server running at 0.0.0.0:${process.env.PORT}`)
    );
  } catch (err) {
    logger.error(err.stack);
  }
})();

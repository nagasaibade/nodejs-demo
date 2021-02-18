const winston = require('winston');

require('winston-daily-rotate-file');
const { format } = require('logform');

const loggerFormat = format.combine(
  format.timestamp(),
  format.align(),
  format.printf(
    (info) =>
      `${info.timestamp.replace('T', ' ').replace('Z', ' ')} | ${info.message}`
  )
);

const httpFileTransport = new winston.transports.DailyRotateFile({
  level: 'info',
  filename: `./logs/${process.env.APP_NAME}-%DATE%-http.log`,
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
});

// Create http activity logger
const httpLogger = winston.createLogger({
  format: loggerFormat,
  transports: [httpFileTransport],
});

httpLogger.stream = {
  write: (message) => {
    httpLogger.info(message);
  },
};

module.exports = httpLogger;

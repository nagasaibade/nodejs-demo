const winston = require('winston');
require('winston-daily-rotate-file');
const { format } = require('logform');

const loggerFormat = format.combine(
  format.timestamp(),
  format.align(),
  format.printf(
    (info) =>
      `${info.timestamp.replace('T', ' ').replace('Z', ' ')} ${info.level}: ${
        info.message
      }`
  )
);

const transports = [];

const consoleTransport = new winston.transports.Console({
  level: 'info',
});

const fileTransport = new winston.transports.DailyRotateFile({
  level: 'warn',
  filename: `./logs/${process.env.APP_NAME}-%DATE%.log`,
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
});

// Add file logger transport to the transports array
transports.push(fileTransport);

// Add console logger transport for non-prod environments
if (process.env.NODE_ENV !== 'production') {
  transports.push(consoleTransport);
}

// Create standard logger
const logger = winston.createLogger({
  format: loggerFormat,
  transports,
});

module.exports = logger;

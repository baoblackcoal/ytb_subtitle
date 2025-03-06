/**
 * Logger module for the calculator application
 * Uses Winston for logging functionality
 */
import * as winston from 'winston';

// Create a logger instance
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf((info) => {
      return `${info.timestamp} ${info.level}: ${info.message}`;
    })
  ),
  transports: [
    // Console transport for development
    new winston.transports.Console(),
    // File transport for production
    new winston.transports.File({ filename: 'calculator.log' })
  ]
});

export default logger;

/**
 * Logger module for the calculator application
 * Uses Winston for logging functionality
 */
const winston = require('winston');

// Create a logger instance
const calculatorLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf((info: { level: string; message: string; timestamp: string }) => {
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

module.exports = { default: calculatorLogger };

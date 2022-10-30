const winston = require('winston');
const expressWinston = require('express-winston');
const { format, createLogger, transports } = require("winston");

const { combine, timestamp, label, printf } = format;
const CATEGORY = "Winston";

const customFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const date = new Date();
const dateStr = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

const logger = winston.createLogger({
  level: "debug",
  format: combine(label({ label: CATEGORY }), timestamp(), customFormat),
  transports: [
    new winston.transports.Console(),

    new transports.File({
      filename: `logs/${dateStr}.log`,
    }),
  ],
});

module.exports = logger;
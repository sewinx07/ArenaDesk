import winston from 'winston';
import config from '../config';

const levels = { error: 0, warn: 1, info: 2, http: 3, debug: 4 };
const level = config.nodeEnv === 'production' ? 'info' : 'debug';

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, requestId, ...meta }) => {
    const reqId = requestId ? ` [req:${requestId}]` : '';
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `${timestamp} ${level}${reqId}: ${message}${metaStr}`;
  })
);

const logger = winston.createLogger({
  level,
  levels,
  format,
  defaultMeta: { service: 'ArenaDesk-os' },
  transports: [
    new winston.transports.Console({ format: consoleFormat }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error', maxsize: 5242880, maxFiles: 5 }),
    new winston.transports.File({ filename: 'logs/combined.log', maxsize: 5242880, maxFiles: 10 }),
  ],
  exitOnError: false,
});

export class LoggerStream {
  write(message: string) {
    logger.http(message.trim());
  }
}

export function childLogger(requestId: string) {
  return logger.child({ requestId });
}

export default logger;

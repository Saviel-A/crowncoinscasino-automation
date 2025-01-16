import { createLogger, format, transports, Logger } from 'winston';

export const logger: Logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({
            format: 'DD-MM-YYYY HH:mm:ss'
        }),
        format.json()
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'logs/info.log', level: 'info' }),
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
        new transports.File({ filename: 'logs/debug.log', level: 'debug' }), 
        new transports.File({ filename: 'logs/combined.log', level: 'info' }),
    ],
    exceptionHandlers: [
        new transports.File({ filename: 'logs/exceptions.log' })
    ],
    rejectionHandlers: [
        new transports.File({ filename: 'logs/rejections.log' })
    ],
});

export const networkLogger: Logger = createLogger({
    level: 'warn',
    format: format.combine(
        format.timestamp({
            format: 'DD-MM-YYYY HH:mm:ss'
        }),
        format.json()
    ),
    transports: [
        new transports.File({ filename: 'logs/network.log', level: 'warn' }),
    ],
});

export const consoleLogger: Logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({
            format: 'DD-MM-YYYY HH:mm:ss'
        }),
        format.json()
    ),
    transports: [
        new transports.File({ filename: 'logs/console.log', level: 'info' }),
    ],
});
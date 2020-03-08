import { Logger, createLogger } from 'winston';
import { JsonWithMetaTransport } from './transports/json-with-meta.transport';
import { ILoggerConfig, ELogLevel, ILogger } from '../logger.interface';

export class WinstonLogger implements ILogger {
    private readonly _logger: Logger;
    private readonly _backupKey: string = '.backup';

    constructor(private readonly _config: ILoggerConfig) {
        this._logger = this._initWinstonInstance(_config);
    }

    public debug(message: any, ...args: any[]): void {
        this._logger[ELogLevel.DEBUG](message, ...args);
    }

    public error(message: any, ...args: any[]): void {
        this._logger[ELogLevel.ERROR](message, ...args);
    }

    public fatal(message: any, ...args: any[]): void {
        this._logger[ELogLevel.FATAL](message, ...args);
    }

    public info(message: any, ...args: any[]): void {
        this._logger[ELogLevel.INFO](message, ...args);
    }

    public log(...args: any[]): void {
        this._logger[ELogLevel.INFO](...args);
    }

    public trace(message: any, ...args: any[]): void {
        this._logger[ELogLevel.TRACE](message, ...args);
    }

    public warn(message: any, ...args: any[]): void {
        this._logger[ELogLevel.WARN](message, ...args);
    }
    public replaceConsole(): void {
        ['log', ...Object.keys(ELogLevel)].map((level) => level.toLowerCase()).forEach((method) => {
            console[method + this._backupKey] = console[method];
            console[method] = (...args: any[]) => {
                this[method]({consoleMessage: args});
            };
        });
    }

    public returnConsoleBack(): void {
        ['log', ...Object.keys(ELogLevel)].map((level) => level.toLowerCase()).forEach((method) => {
            if (console[method + this._backupKey]) {
                (console[method] = console[method + this._backupKey]);
            }
        });
    }

    private _initWinstonInstance(config: ILoggerConfig): Logger {
        const logger = createLogger({
            levels: {
                [ELogLevel.TRACE]: 5,
                [ELogLevel.DEBUG]: 4,
                [ELogLevel.INFO]: 3,
                [ELogLevel.WARN]: 2,
                [ELogLevel.ERROR]: 1,
                [ELogLevel.FATAL]: 0,
            },
        });

        logger.level = config.level;
        logger.add(new JsonWithMetaTransport({
            level: config.level,
            lineSeparator: config.format.separator,
        }));

        return logger;
    }
}

export interface ILogger {
    log(...args: any[]): void;
    trace(message: any, ...args: any[]): void;
    debug(message: any, ...args: any[]): void;
    info(message: any, ...args: any[]): void;
    warn(message: any, ...args: any[]): void;
    error(message: any, ...args: any[]): void;
    fatal(message: any, ...args: any[]): void;
    replaceConsole(): void;
    returnConsoleBack(): void;
}

export interface ILoggerConfig {
    level: ELogLevel;
    printStackTrace?: boolean;
    format: {
        separator?: string
    };
}

export enum ELogLevel {
    TRACE = 'TRACE',
    DEBUG = 'DEBUG',
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR',
    FATAL = 'FATAL'
}

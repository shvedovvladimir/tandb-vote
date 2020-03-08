export interface IConfiguration {
    readonly app: IAppConfiguration;
    readonly swagger: ISwaggerConfiguration;
    readonly jwt: IJwtPoolConfiguration;
    readonly logger: ILoggerConfiguration;
}

export interface IJwtPoolConfiguration {
    main: IJwtConfiguration;
}

export interface IJwtConfiguration {
    readonly secret: string;
    readonly expiresIn: number;
}

export interface ISwaggerConfiguration {
    readonly title: string;
    readonly scheme: 'http' | 'https';
    readonly description: string;
    readonly apiVersion: string | number;
    readonly enableAuth: boolean;
    readonly guiUri: string;
    readonly jsonUri: string;
}

export interface IAppConfiguration {
    readonly port: string | number;
}

export interface ILoggerConfiguration {
    readonly level: string;
    readonly printStackTrace: boolean;
    readonly format: {
        readonly separator: string;
    };
}

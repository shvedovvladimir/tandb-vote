import { IConfiguration } from './configuration.interface';

// tslint:disable-next-line: no-default-export
export default (): IConfiguration => ({
    app: {
        port: process.env.APP_PORT || 9080,
    },
    jwt: {
        main: {
            secret: process.env.JWT_SECRET,
            expiresIn: 24, // in hour
        },
    },
    logger: {
        level: process.env.LOG_LEVEL || 'DEBUG',
        printStackTrace: true,
        format: {
            separator: '\n',
        },
    },
    swagger: {
        scheme: process.env.SWAGGER_SCHEME as ESchemeType || 'http',
        title: process.env.SWAGGER_TITLE,
        description: process.env.SWAGGER_DESCRIPTION,
        apiVersion: 1,
        enableAuth: Boolean(process.env.SWAGGER_AUTH_ENABLED),
        guiUri: process.env.SWAGGER_GUI_URI,
        jsonUri: process.env.SWAGGER_JSON_URI,
    },
});

enum ESchemeType {
    http = 'http',
    https = 'https',
}

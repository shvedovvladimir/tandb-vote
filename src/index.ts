import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { ValidationExceptionFilter } from './app/common/filter/validation-exception.filter';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import { CommonModule } from './app/common/common.module';
import configuration from '../config/configuration';
import { ILogger } from './app/common/logger';
import { LOGGER } from './app/vote-api-v1/di-constants';

async function bootstrap(): Promise<INestApplication> {
    const conf = configuration();

    const app = await NestFactory.create<NestExpressApplication>(
        ApplicationModule, new ExpressAdapter(),
    );

    app.use(cookieParser());
    app.enableCors({ origin: true });
    const logger = app.get<ILogger>(LOGGER);
    logger.replaceConsole();

    process.on('uncaughtException', function(err: Error): void {
        logger.fatal('uncaughtException', err.message, err.stack);
    });

    app.useGlobalFilters(app.select(CommonModule).get<ValidationExceptionFilter>(ValidationExceptionFilter));

    const options = new DocumentBuilder()
        .setTitle(conf.swagger.title)
        .setDescription(conf.swagger.description)
        .setVersion(conf.swagger.apiVersion as string)
        .setSchemes(conf.swagger.scheme)
        .build();

    const v1Document = SwaggerModule.createDocument(
        app,
        options,
    );

    SwaggerModule.setup('/swagger', app, v1Document);
    SwaggerModule.setup('/swagger-json', app, v1Document);

    await app.listen(conf.app.port);

    app.disable('x-powered-by');
    app.disable('etag');

    return app;
}

async function main(): Promise<void> {
    try {
        const app = await bootstrap();
        // tslint:disable-next-line
        console.log('[Main] App started');
    } catch (err) {

        // tslint:disable-next-line
	console.error('[Main] Error on bootstrap', err);
    }
}

main();

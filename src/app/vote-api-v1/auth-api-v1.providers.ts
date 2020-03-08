import { DI_CONSTANTS, LOGGER } from './di-constants';
import { ILogger, WinstonLogger } from '../common/logger';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { ILoggerConfig } from '../common/logger/logger.interface';
import { JwtService } from './services/jwt/jwt.service';
import { TokenService } from './services/token-service/token.service';

export const serviceContainerModule = [
    {
        provide: DI_CONSTANTS.IJwtService,
        useClass: JwtService,
    },
    {
        provide: DI_CONSTANTS.ITokenService,
        useClass: TokenService,
    },
];

export const loggerProvider = {
    provide: LOGGER,
    useFactory: (config: ConfigService): ILogger => {
        return new WinstonLogger(config.get<ILoggerConfig>('logger'));
    },
    imports: [ConfigModule],
    inject: [ConfigService],
};
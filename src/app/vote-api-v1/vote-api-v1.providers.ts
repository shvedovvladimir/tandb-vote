import { DI_CONSTANTS, LOGGER } from './di-constants';
import { ILogger, WinstonLogger } from '../common/logger';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { ILoggerConfig } from '../common/logger/logger.interface';
import { VoteService } from './services/vote-service/vote.service';

export const serviceContainerModule = [
    {
        provide: DI_CONSTANTS.IVoteService,
        useClass: VoteService,
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
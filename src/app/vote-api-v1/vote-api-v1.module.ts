import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VoteController } from './controllers/vote.controller';
import { serviceContainerModule, loggerProvider } from './vote-api-v1.providers';
import { HealthCheckModule } from '../common/healthcheck/health-check.module';
import configuration from '../../../config/configuration';
import { ConfigModule } from '@nestjs/config';
import { entities } from './entities/entities';

@Module({
    imports: [
        TypeOrmModule.forRoot(),
        TypeOrmModule.forFeature(entities),
        CommonModule,
        HealthCheckModule,
        ConfigModule.forRoot({
            load: [configuration],
        }),
    ],
    controllers: [
        VoteController,
    ],
    providers: [
        // main providers
        ...serviceContainerModule,

        loggerProvider,
    ],
    exports: [ loggerProvider ],
})
export class VoteApiV1Module { }

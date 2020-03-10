import { Module } from '@nestjs/common';
import { VoteApiV1Module } from './vote-api-v1/vote-api-v1.module';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../config/configuration';
@Module({
    imports: [
        VoteApiV1Module,
        ConfigModule.forRoot({
            load: [configuration],
        }),
    ],
})
export class ApplicationModule {}
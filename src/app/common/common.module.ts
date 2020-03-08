import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ErrorFilter } from './filter/exception.filter';
import { ValidationExceptionFilter } from './filter/validation-exception.filter';

@Module({
    imports: [ ],
    providers: [
        ErrorFilter, ValidationExceptionFilter,
    ],
    exports: [
        ErrorFilter, ValidationExceptionFilter,
    ],
})
export class CommonModule implements NestModule {
    public configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
        return;
    }
}

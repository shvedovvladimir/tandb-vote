import { ArgumentsHost, Catch, Injectable } from '@nestjs/common';
import { ErrorFilter } from './exception.filter';
import { ValidationError } from '../errors/validation.error';

@Catch(Error)
@Injectable()
export class ValidationExceptionFilter extends ErrorFilter {

    public catch(catchedError: any, host: ArgumentsHost): void {

        if (!(catchedError instanceof ValidationError)) {
            super.catch(catchedError, host);

            return;
        }

        const response = host.switchToHttp().getResponse();

        const exception = catchedError;

        if (catchedError.stack) {
            exception.stack = catchedError.stack;
        }

        // tslint:disable
        console.error(exception as any);
        // tslint:enable

        response.status(exception.status).json({
            error: {
                statusCode: exception.status,
                code: exception.code || 'ERROR',
                details: exception.publicDetails || exception.message || 'Internal error',
            },
        });
    }
}
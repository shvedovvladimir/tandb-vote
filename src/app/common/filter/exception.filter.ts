import { Catch, ExceptionFilter, HttpException, Injectable } from '@nestjs/common';
import { CommonError } from '../errors/common';

@Catch(Error)
@Injectable()
export class ErrorFilter implements ExceptionFilter {

    protected readonly interval: number;
    protected readonly tick: number;
    protected readonly timer: any;

    public catch(catchedErr: any, context: any): void {
        const response = context.switchToHttp().getResponse();

        let exception: CommonError = catchedErr;

        if (!(catchedErr instanceof CommonError)) {
            exception = new CommonError(
                catchedErr.message || '', catchedErr.code || 'ERROR', {info: JSON.stringify(catchedErr)},
            );

            if (catchedErr instanceof HttpException) {
                exception.status = catchedErr.getStatus();
            }
        }

        if (catchedErr.stack) {
            exception.stack = catchedErr.stack;
        }

        let details = exception.publicDetails || exception.message || 'Internal error';

        if (!(catchedErr instanceof CommonError)) {
            details = exception.publicDetails || 'Internal error';
        }

        response
            .status(exception.status)
            .json({
                error: {
                    statusCode: exception.status,
                    code: exception.code || 'ERROR',
                    details,
                },
            });
    }
}

import {HttpStatus} from '@nestjs/common';
import {CommonError} from './common';

export class ValidationError extends CommonError {
    public static readonly CODE_DEFAULT: string = 'VALIDATION';

    public status: number = HttpStatus.BAD_REQUEST;

    constructor(validationDetails: any) {
        super(
            null,
            ValidationError.CODE_DEFAULT,
            null,
            validationDetails,
        );
    }
}
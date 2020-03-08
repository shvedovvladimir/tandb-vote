import { HttpStatus } from '@nestjs/common';
import { CommonError } from '../../common/errors/common';

export class InvalidTokenError extends CommonError {
    public status: number = HttpStatus.BAD_REQUEST;

    constructor(info: object) {
        super(
            'token is invalid',
            'INVALID_TOKEN',
            info,
        );
    }
}

import {HttpStatus} from '@nestjs/common';

export class CommonError extends Error {
    public status: number = HttpStatus.INTERNAL_SERVER_ERROR;

    constructor(
        public message: string,
        public code: string,
        public innerDetails?: object,
        public publicDetails?: object,
    ) {
        super(message);
    }

    public getErrorInfo(): object {
        return {
            status: this.status,
            errorClass: this.constructor.name,
            code: this.code,
            message: this.message,
            details: this.publicDetails,
            innerDetails: this.innerDetails,
            stack: this.stack,
        };
    }

    public toString(): string {
        return JSON.stringify(this.getErrorInfo());
    }
}

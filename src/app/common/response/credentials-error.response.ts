import { ApiModelProperty } from '@nestjs/swagger';
import { CommonErrorResponse } from './common-error.response';

export class CredentialsErrorResponse extends CommonErrorResponse {
    @ApiModelProperty({example: 400})
    public readonly status_code: number;

    @ApiModelProperty({
        enum: ['VALIDAION', 'INVALID_CREDENTIALS'],
        example: 'INVALID_CREDENTIALS',
    })
    public readonly code: string;

}
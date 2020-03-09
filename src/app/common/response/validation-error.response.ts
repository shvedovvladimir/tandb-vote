import { ApiModelProperty } from '@nestjs/swagger';
import { CommonErrorResponse } from './common-error.response';

// NOTE rule 1 max class per file
/* tslint:disable */
class ValidationDetails {
    @ApiModelProperty()
    public target: object;

    @ApiModelProperty()
    public value: string;

    @ApiModelProperty()
    public property: string;

    @ApiModelProperty()
    public constraints: object;
}

export class ValidationErrorResponse extends CommonErrorResponse {
    @ApiModelProperty({enum: ['VALIDATION']} as any)
    public code: string;

    @ApiModelProperty({type: ValidationDetails})
    public details: any | string;
}
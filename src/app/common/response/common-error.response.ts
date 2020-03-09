import { ApiModelProperty } from '@nestjs/swagger';

export class CommonErrorResponse {
    @ApiModelProperty({
        type: 'number',
        default: 500,
        example: 500,
    })
    public status_code: number;

    @ApiModelProperty({
        type: 'string',
        example: 'INTERNAL',
    })
    public code: string;

    @ApiModelProperty()
    public details: any;
}
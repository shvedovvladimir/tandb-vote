import { ApiModelProperty } from '@nestjs/swagger';

export class GetResultDto {
    @ApiModelProperty()
    public readonly limit: number;

    @ApiModelProperty()
    public readonly offset: number;

    @ApiModelProperty()
    public readonly accessKeyId: number;
}
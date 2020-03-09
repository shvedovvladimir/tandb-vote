import { ApiModelProperty } from '@nestjs/swagger';

export class LimitOffsetForDto {
    @ApiModelProperty()
    public readonly limit: number;

    @ApiModelProperty()
    public readonly offset: number;
}
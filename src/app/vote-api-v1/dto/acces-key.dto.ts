import { ApiModelProperty } from '@nestjs/swagger';

export class AccessKeyDto {
    @ApiModelProperty()
    public readonly accessKey: string;
}
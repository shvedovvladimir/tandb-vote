import { ApiModelProperty } from '@nestjs/swagger';

export class TokenDto {
    @ApiModelProperty()
    public readonly accessToken: string;
}
import { ApiModelProperty } from '@nestjs/swagger';

export class TokenResponse {
    @ApiModelProperty()
    public readonly accessToken: string;
}
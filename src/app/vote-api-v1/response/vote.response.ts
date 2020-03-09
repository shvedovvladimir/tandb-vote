import { ApiModelProperty } from '@nestjs/swagger';

export class VoteResponse {
    @ApiModelProperty()
    public readonly success: boolean;
}
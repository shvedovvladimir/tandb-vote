import { ApiModelProperty } from '@nestjs/swagger';

export class VoteResultResponse {
    @ApiModelProperty()
    public readonly votes: number;

    @ApiModelProperty()
    public readonly position: number;

    @ApiModelProperty()
    public readonly name: string;
}
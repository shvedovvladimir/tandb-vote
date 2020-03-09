import { ApiModelProperty } from '@nestjs/swagger';

export class VoteForDto {
    @ApiModelProperty()
    public readonly voteFor: string;

    @ApiModelProperty()
    public readonly accessKeyId: number;
}
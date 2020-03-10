import {
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Inject,
    Injectable,
    Body,
    Get,
    Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { AbstractController } from '../../common/controller/abstract.controller';
import { CredentialsErrorResponse } from '../../common/response/credentials-error.response';
import { CommonErrorResponse } from '../../common/response/common-error.response';
import { DI_CONSTANTS } from '../di-constants';
import { JoiValidationPipe } from '../../common/pipes/joi-validation.pipe';
import { VoteForDto } from '../dto/vote-for.dto';
import { voteForJoiSchema } from '../schemas/vote-for.schemas';
import { IVoteService, IVoteResponse, IVoteResultsResponse } from '../services/vote-service/vote.service.interface';
import { VoteResponse } from '../response/vote.response';
import { GetResultDto } from '../dto/get-result.dto';
import { getResultJoiSchema } from '../schemas/get-result.schemas';
import { VoteResultResponse } from '../response/vote-result.response';

@Controller('api')
@ApiUseTags('Vote service api')
@Injectable()
export class VoteController extends AbstractController {

    constructor(
        @Inject(DI_CONSTANTS.IVoteService)
        private readonly _voteService: IVoteService,
    ) {
        super();
    }

    @Post('vote')
    @ApiOperation(
        {
            title: 'Adds new vote to database, if a record “voteFor” does not exist creates one',
        },
    )
    @ApiResponse({
        status: 200,
        type: VoteResponse,
    })
    @ApiResponse({
        status: 400,
        type: CredentialsErrorResponse,
    })
    @ApiResponse({
        status: 500,
        type: CommonErrorResponse,
    })
    @HttpCode(HttpStatus.OK)
    public async vote(
        @Body(new JoiValidationPipe(voteForJoiSchema)) voteForDto: VoteForDto,
    ): Promise<IVoteResponse> {
        const resp = await this._voteService.voteFor(voteForDto.voteFor, voteForDto.accessKeyId);

        return resp;
    }

    @Get('results')
    @ApiOperation(
        {
            title: 'Returns a list of items of a poll which is available only for voted token',
        },
    )
    @ApiResponse({
        status: 200,
        type: VoteResultResponse,
        isArray: true,
    })
    @ApiResponse({
        status: 400,
        type: CredentialsErrorResponse,
    })
    @ApiResponse({
        status: 500,
        type: CommonErrorResponse,
    })
    @HttpCode(HttpStatus.OK)
    public async result(
        @Query(new JoiValidationPipe(getResultJoiSchema)) getResultDto: GetResultDto,
    ): Promise<IVoteResultsResponse[]> {
        const resp = await this._voteService
            .getVotedItemListForAccessKey(getResultDto.accessKeyId, getResultDto.limit, getResultDto.offset);

        return resp;
    }
}
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
import { IVoteService, IVoteResponse } from '../services/vote-service/vote.service.interface';
import { VoteResponse } from '../response/vote.response';
import { limitOffsetJoiSchema } from '../schemas/limit-offset.schemas';
import { LimitOffsetForDto } from '../dto/limit-offset.dto';

@Controller('api')
@ApiUseTags('Vote service api')
@Injectable()
export class AuthController extends AbstractController {

    constructor(
        @Inject(DI_CONSTANTS.IVoteService)
        private readonly _tandbAuthProxyService: IVoteService,
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
        const resp = await this._tandbAuthProxyService.voteFor(voteForDto.voteFor, voteForDto.accessKeyId);

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
    public async result(
        @Query(new JoiValidationPipe(limitOffsetJoiSchema)) limitOffsetForDto: LimitOffsetForDto,
    ): Promise<any> {
        const resp = await this._tandbAuthProxyService
            .getVotedItemListForAccessKey(1, limitOffsetForDto.limit, limitOffsetForDto.offset);

        return resp;
    }
}
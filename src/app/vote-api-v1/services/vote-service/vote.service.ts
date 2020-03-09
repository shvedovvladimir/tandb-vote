import { Injectable, Inject } from '@nestjs/common';
import { LOGGER } from '../../di-constants';
import { ILogger } from '../../../common/logger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IVoteService, IVoteResponse, IVoteResultsResponse } from './vote.service.interface';
import { VoteHistoryEntity } from '../../entities/typeorm/vote-history.entity';
import { VoteForItemEntity } from '../../entities/typeorm/vote-for-item.entity';
import { AccessKeyVoteItemEntity } from '../../entities/typeorm/access-key-vote-item.entity';
import { ResultItemPositionEntity } from '../../entities/typeorm/result-item-position.entity';
import { performance } from 'perf_hooks';

@Injectable()
export class VoteService implements IVoteService {
    private readonly _loggerPrefix: string = `${VoteService.name}`;

    constructor(
        @InjectRepository(VoteHistoryEntity)
        protected readonly _voteHistoryRepository: Repository<VoteHistoryEntity>,
        @InjectRepository(VoteForItemEntity)
        protected readonly _voteForItemRepository: Repository<VoteForItemEntity>,
        @InjectRepository(AccessKeyVoteItemEntity)
        protected readonly _accessKeyVoteItemEntityRepository: Repository<AccessKeyVoteItemEntity>,
        @InjectRepository(ResultItemPositionEntity)
        protected readonly _resultItemPositionRepository: Repository<ResultItemPositionEntity>,
        @Inject(LOGGER)
        private readonly _logger: ILogger,
    ) {}

    public async voteFor(voteFor: string, accessKeyId: number): Promise<IVoteResponse> {
        this._logger.debug(this._loggerPrefix, `Try add vote for: ${voteFor} by access key: ${accessKeyId}`);

        try {
            let voteForItem = null;

            const resp = await this._voteHistoryRepository.manager.transaction(async (entityManager) => {
                await entityManager
                    .getRepository(VoteForItemEntity)
                    .createQueryBuilder()
                    .andWhere('"deleted_at" IS NULL');

                voteForItem = await entityManager
                    .getRepository(VoteForItemEntity)
                    .createQueryBuilder()
                    .where('"item_name" = :voteFor', {voteFor})
                    .andWhere('"deleted_at" IS NULL')
                    .getOne();

                if (!voteForItem) {
                    const newVoteForItem = {
                        itemName: voteFor,
                        votes: 1,
                    };

                    await entityManager
                        .getRepository(VoteForItemEntity)
                        .createQueryBuilder()
                        .insert()
                        .into(VoteForItemEntity)
                        .values(newVoteForItem)
                        .onConflict(`("item_name") DO NOTHING`)
                        .execute();

                    voteForItem = await entityManager
                        .getRepository(VoteForItemEntity)
                        .createQueryBuilder()
                        .where('"item_name" = :voteFor', {voteFor})
                        .andWhere('"deleted_at" IS NULL')
                        .getOne();
                }

                await entityManager
                    .getRepository(VoteForItemEntity)
                    .update(
                        { voteForItemId: voteForItem.voteForItemId },
                        { votes: Number(voteForItem.votes) + 1 },
                    );

                const newVote = {
                    accessKeyId,
                    voteForItemId: voteForItem.voteForItemId,
                };

                await entityManager
                    .getRepository(AccessKeyVoteItemEntity)
                    .createQueryBuilder()
                    .insert()
                    .into(AccessKeyVoteItemEntity)
                    .values(newVote)
                    .onConflict(`("access_key_id", "vote_for_item_id") DO NOTHING`)
                    .execute();

                const createdVote = await entityManager
                    .getRepository(VoteHistoryEntity).save(
                        entityManager.getRepository(VoteHistoryEntity).create(newVote),
                    );

                return {
                    success: !!createdVote,
                };
            });

            return resp;
        } catch (err) {
            this._logger.error(
                this._loggerPrefix,
                `Got error while vote`,
                voteFor,
                err.message,
            );

            throw err;
        }
    }

    public async getVotedItemListForAccessKey(
        accessKeyId: number, limit: number, offset: number,
    ): Promise<IVoteResultsResponse[]> {
        this._logger.debug(this._loggerPrefix, `Try get vote for access key: ${accessKeyId} ${offset}`);

        try {
            const tStart = performance.now();
            const resp = await this._resultItemPositionRepository.createQueryBuilder()
                .select('votes')
                .addSelect('item_position', 'position')
                .addSelect('item_name', 'name')
                .where(`vote_for_item_id = any(array(
                    select vote_for_item_id
                    from production.access_key_vote_item
                    where access_key_id = :accessKeyId))
                `, {accessKeyId})
                .orderBy('"votes"', 'DESC')
                .skip(offset)
                .take(limit)
                .getRawMany();

            const tEnd = performance.now();
            this._logger
                .debug(this._loggerPrefix, `got response for access key: ${accessKeyId}. Time: ${tEnd - tStart} ms`);

            return resp;
        } catch (err) {
            this._logger.error(
                this._loggerPrefix,
                `Got error while getting vote result for access key: ${accessKeyId}`,
                err.message,
            );

            throw err;
        }
    }
}

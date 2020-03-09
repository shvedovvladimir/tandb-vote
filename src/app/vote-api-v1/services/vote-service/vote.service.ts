import { Injectable, Inject } from '@nestjs/common';
import { LOGGER } from '../../di-constants';
import { ILogger } from '../../../common/logger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { IVoteService, IVoteResponse, IVoteResultsResponse } from './vote.service.interface';
import { VoteHistoryEntity } from '../../entities/typeorm/vote-history.entity';
import { VoteForItemEntity } from '../../entities/typeorm/vote-for-item.entity';
import { AccessKeyVoteItemEntity } from '../../entities/typeorm/access-key-vote-item.entity';

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
                    .andWhere('"deleted_at" IS NULL')
                    .setLock('pessimistic_write');

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
                err, // trace
                err.message,
            );

            throw err;
        }
    }

    public async getVotedItemListForAccessKey(
        accessKeyId: number, limit: number, offset: number,
    ): Promise<IVoteResultsResponse[]> {
        return this._accessKeyVoteItemEntityRepository.createQueryBuilder()
            .distinctOn(['vote.vote_for_item_id, votes'])
            .select('vote.vote_for_item_id', 'voteForItemId')
            .from('access_key_vote_item', 'vote')
            .leftJoinAndSelect((subQuery: SelectQueryBuilder<VoteForItemEntity>) => {
                return subQuery
                    .select((subQuery: SelectQueryBuilder<VoteForItemEntity>) => {
                        return subQuery
                            .select('COUNT("votes") + 1', 'countV')
                            .from((subQuery: SelectQueryBuilder<VoteForItemEntity>) => {
                                return subQuery
                                    .select('"votes"')
                                    .from('vote_for_item', 'v2')
                                    .where('v2.votes > v1.votes')
                                    .groupBy('v2.votes');
                            }, 'sq');
                }, 'position')
                .addSelect('v1.vote_for_item_id', 'voteForItemId')
                .addSelect('v1.item_name', 'name')
                .addSelect('v1.votes', 'votes')
                .from('vote_for_item', 'v1');
            }, 'v1', 'v1."voteForItemId" = vote.vote_for_item_id')
            .where('vote.access_key_id = :accessKeyId', {accessKeyId})
            .orderBy('votes', 'DESC')
            .limit(limit)
            .offset(offset)
            .getRawMany();
    }
}
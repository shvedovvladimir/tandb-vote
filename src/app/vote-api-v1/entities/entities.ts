import { VoteForItemEntity } from './typeorm/vote-for-item.entity';
import { VoteHistoryEntity } from './typeorm/vote-history.entity';
import { AccessKeyVoteItemEntity } from './typeorm/access-key-vote-item.entity';

export const entities = [
    VoteForItemEntity,
    VoteHistoryEntity,
    AccessKeyVoteItemEntity,
];
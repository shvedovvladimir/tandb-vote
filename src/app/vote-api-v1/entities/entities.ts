import { VoteForItemEntity } from './typeorm/vote-for-item.entity';
import { VoteHistoryEntity } from './typeorm/vote-history.entity';
import { AccessKeyVoteItemEntity } from './typeorm/access-key-vote-item.entity';
import { ResultItemPositionEntity } from './typeorm/result-item-position.entity';

export const entities = [
    VoteForItemEntity,
    VoteHistoryEntity,
    AccessKeyVoteItemEntity,
    ResultItemPositionEntity,
];
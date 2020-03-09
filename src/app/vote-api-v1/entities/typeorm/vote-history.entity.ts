import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity({
    name: 'vote_history',
})
export class VoteHistoryEntity {
    @PrimaryColumn({
        name: 'vote_id',
    })
    public voteId: number;

    @Column({
        name: 'access_key_id',
    })
    public accessKeyId: number;

    @Column({
        name: 'vote_for_item_id',
    })
    public voteForItemId: number;

    @CreateDateColumn({
        name: 'created_at',
    })
    public createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at',
    })
    public updatedAt: Date;

    @Column('timestamp', {
        nullable: true,
        name: 'deleted_at',
    })
    public deletedAt: Date | null;
}

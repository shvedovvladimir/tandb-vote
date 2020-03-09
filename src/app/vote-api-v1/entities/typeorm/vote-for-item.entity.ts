import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity({
    name: 'vote_for_item',
})
export class VoteForItemEntity {
    @PrimaryColumn({
        name: 'vote_for_item_id',
    })
    public voteForItemId: number;

    @Column({
        name: 'item_name',
    })
    public itemName: string;

    @Column('jsonb', {
        nullable: true,
        name: 'item_meta',
    })
    public itemMeta: number;

    @Column({
        name: 'votes',
    })
    public votes: number;

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

import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity({
    name: 'token',
})
export class TokenEntity {
    @PrimaryColumn({
        name: 'token_id',
    })
    public tokenId: number;

    @Column({
        name: 'access_key',
    })
    public accessKey: string;

    @Column({
        name: 'token_value',
    })
    public tokenValue: string;

    @Column({
        name: 'token_type',
    })
    public tokenType: string;

    @Column('jsonb', {
        nullable: true,
        name: 'token_meta',
    })
    public tokenMeta: any;

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

    @Column({
        name: 'expires_in',
    })
    public expiresIn: number;
}

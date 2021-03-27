import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UpdateUrl 
{
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ length: 255 })
    hash?: string;

    @Column({ length: 512 })
    originalUrl?: string;

    @Column({ length: 255})
    shortUrl?: string;

    @Column()
    safeRedirect?: number;

    @Column()
    hasThreats?: number;

    @Column('datetime', { select: true })
    createdAt?: Date;

    @Column('datetime', { select: false })
    deletedAt?: Date;
}

import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Url 
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    hash?: string;

    @Column({ length: 512 })
    originalUrl: string;

    @Column({ length: 255})
    shortUrl?: string;

    @Column('datetime', { select: true })
    createdAt?: Date;

    @Column('datetime', { select: false })
    deletedAt?: Date;
}

import { Column, Entity, Generated, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Threat } from "./threat.entity";

@Entity()
export class Url 
{
    @Generated()
    id: number;

    @PrimaryColumn({ length: 255 })
    hash?: string;

    @Column({ length: 512 })
    originalUrl: string;

    @Column({ length: 255})
    shortUrl?: string;

    @Column()
    safeRedirect: number;

    @Column()
    hasThreats?: number;

    @Column('datetime', { select: true })
    createdAt?: Date;

    @Column('datetime', { select: false })
    deletedAt?: Date;

    @OneToMany(type => Threat, threat => threat.url)
    threats: Threat[];

}

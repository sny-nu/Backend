import { Column, Entity, Generated, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Analytics } from "./analytics.entity";
import { Threat } from "./threat.entity";

@Entity()
export class Url 
{
    @PrimaryColumn({ length: 255 })
    hash?: string;

    @Column({ length: 512, nullable: false })
    originalUrl: string;

    @Column({ length: 255, nullable: false })
    shortUrl?: string;

    @Column('int', { default: 0, nullable: false })
    safeRedirect: number;

    @Column('int', { default: 0, nullable: false })
    hasThreats?:  number;

    @Column({ select: true, type: "timestamp", default: () => "CURRENT_TIMESTAMP", nullable: false })
    createdAt?: Date;

    @Column('timestamp', { select: false })
    deletedAt?: Date;

    @OneToMany(type => Threat, threat => threat.url)
    threats: Threat[];

    @OneToMany(type => Analytics, analytics => analytics.url)
    analytics: Analytics[];
}

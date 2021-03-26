import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Url } from "./url.entity";

@Entity()
export class Analytics 
{
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ length: 50, nullable: false })
    urlHash?: string;

    @Column({ length: 255, default: "Unknown", nullable: true })
    device?: string;

    @Column({ length: 255, default: "Unknown", nullable: true })
    deviceType?: string;

    @Column({ length: 255, default: "Unknown", nullable: true })
    deviceVendor?: string;

    @Column({ length: 255, default: "Unknown", nullable: true })
    engine?: string;

    @Column({ length: 255, default: "Unknown", nullable: true })
    os?: string;

    @Column({ length: 255, default: "Unknown", nullable: true })
    osVersion?: string;

    @Column({ length: 255, default: "Unknown", nullable: true })
    browser?: string;

    @Column({ length: 255, default: "Unknown", nullable: true })
    browserVersion?: string;

    @Column('int', { default: 1, nullable: false })
    isVisited?:  number;

    @Column({ select: true, type: "timestamp", default: () => "CURRENT_TIMESTAMP", nullable: false })
    requestedOn?: Date;

    @ManyToOne(type => Url, url => url.analytics)
    url: Url;
}

import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, Generated, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Analytics } from "./analytics.entity";
import { Threat } from "./threat.entity";

@Entity()
export class Url 
{
    @ApiProperty({
        description: 'The url hash that will be generated',
        required: false
    })
    @PrimaryColumn({ length: 255 })
    hash?: string;

    @ApiProperty({
        description: 'The original url that is going to be shortened',
        required: true
    })
    @Column({ length: 512, nullable: false })
    originalUrl: string;

    @ApiProperty({
        description: 'The complete shorturl ',
        required: false
    })
    @Column({ length: 255, nullable: false })
    shortUrl?: string;

    @ApiProperty({
        description: 'This property allows you to make it a saferedirect, with a 5 second countdown',
        required: true,
        default: 0
    })
    @Column('int', { default: 0, nullable: false })
    safeRedirect: number;

    @ApiProperty({
        description: 'This property tells if the url has threats. Is filled in after the url is generated',
        required: false
    })
    @Column('int', { default: 0, nullable: false })
    hasThreats?:  number;

    @ApiProperty({
        description: 'Auto generated column with created date time ',
        required: false
    })
    @Column({ select: true, type: "timestamp", default: () => "CURRENT_TIMESTAMP", nullable: false })
    createdAt?: Date;

    @Column('timestamp', { select: false })
    deletedAt?: Date;

    @OneToMany(type => Threat, threat => threat.url)
    threats: Threat[];

    @OneToMany(type => Analytics, analytics => analytics.url)
    analytics: Analytics[];
}

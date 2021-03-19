import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Url } from "./url.entity";

@Entity()
export class Threat
{
    @PrimaryColumn({ length: 50 })
    urlHash: string;

    @Column({ length: 50 })
    type: string;

    @ManyToOne(type => Url, url => url.threats)
    url: Url;

}

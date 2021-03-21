import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Url } from "./url.entity";

@Entity()
@Unique("url_threat", ["urlHash", "type"])
export class Threat
{
    @PrimaryColumn({ length: 50 })
    urlHash: string;

    @PrimaryColumn({ length: 50 })
    type: string;

    @ManyToOne(type => Url, url => url.threats)
    url: Url;

}

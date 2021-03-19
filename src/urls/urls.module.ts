import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ThreatsModule } from "src/threats/threats.module";
import { UrlsController } from "./urls.controller";
import { UrlsRepository } from "./urls.repository";
import { UrlsService } from "./urls.service";

@Module({
    imports:[
        TypeOrmModule.forFeature([UrlsRepository]),
        ThreatsModule
    ],
    providers: [UrlsService],
    controllers: [UrlsController],
    exports: [UrlsService]
})
export class UrlsModule {}

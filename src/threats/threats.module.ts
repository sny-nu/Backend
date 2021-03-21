import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UrlsModule } from "src/urls/urls.module";
import { ThreatsController } from "./threats.controller";
import { ThreatsRepository } from "./threats.repository";
import { ThreatsService } from "./threats.service";

@Module({
    imports:[
        TypeOrmModule.forFeature([ThreatsRepository]),
        UrlsModule
    ],
    providers: [ThreatsService],
    controllers: [ThreatsController],
    exports: [ThreatsService]
})
export class ThreatsModule {}

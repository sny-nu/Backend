import { BullModule } from "@nestjs/bull";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UrlsController } from "./urls.controller";
import { UrlsRepository } from "./urls.repository";
import { UrlsService } from "./urls.service";

@Module({
    imports:[
        TypeOrmModule.forFeature([UrlsRepository]),
        BullModule.registerQueueAsync({
            name: process.env.REDIS_QUEUE_NAME
        }),
    ],
    providers: [UrlsService],
    controllers: [UrlsController],
    exports: [UrlsService]
})
export class UrlsModule {}

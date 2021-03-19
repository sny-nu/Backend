import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ThreatsController } from "./threats.controller";
import { ThreatsRepository } from "./threats.repository";
import { ThreatsService } from "./threats.service";

@Module({
    imports:[
        TypeOrmModule.forFeature([ThreatsRepository]),
    ],
    providers: [ThreatsService],
    controllers: [ThreatsController],
    exports: [ThreatsService]
})
export class ThreatsModule {}

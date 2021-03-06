import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';

import * as dotenv from 'dotenv';
import { ThreatsModule } from './threats/threats.module';
import { UrlsModule } from './urls/urls.module';
dotenv.config();

@Module(
{
    imports: 
    [
        UrlsModule,
        ThreatsModule,
        BullModule.forRoot({
            redis: {
                host: process.env.REDIS_URL,
                port: 6380,
            },
        }),
        ThrottlerModule.forRoot({
            ttl: 60,
            limit: 10,
        }),
        TypeOrmModule.forRoot(
        {
            type: 'mysql',
            host: process.env.DB_HOST,
            port: 3306,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            entities: [__dirname + '/entities/*.entity{.ts,.js}'],
            synchronize: true,
        }),
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
})
export class AppModule {}

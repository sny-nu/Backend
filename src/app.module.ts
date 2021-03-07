import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import * as dotenv from 'dotenv';
import { UrlsModule } from './urls/urls.module';
dotenv.config();

@Module(
{
    imports: 
    [
        UrlsModule,
        TypeOrmModule.forRoot(
        {
            type: 'mysql',
            host: process.env.DB_HOST,
            port: 3306,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            entities: [__dirname + '/entities/*.entity{.ts,.js}'],
            synchronize: false,
        }),
    ],
})
export class AppModule {}

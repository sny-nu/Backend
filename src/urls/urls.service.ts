import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UrlsRepository } from './urls.repository';
import { Url } from 'src/entities/url.entity';
import * as dotenv from 'dotenv';
import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { UpdateResult } from 'typeorm';
import { UpdateUrl } from 'src/entities/extra/updateUrl.entity';

const cryptoRandomString = require('crypto-random-string');
dotenv.config();

@Injectable()
export class UrlsService 
{
    constructor(
        @InjectQueue(process.env.REDIS_QUEUE_NAME) private urlHashQueue: Queue,
        @InjectRepository(UrlsRepository) private readonly urlsRepository: UrlsRepository,
    )
    {}

    async getAll(): Promise<Url[]>
    {
        return await this.urlsRepository.getAll();
    }

    async getByHash(urlHash: string): Promise<Url>
    {
        return await this.urlsRepository.getByHash(urlHash);
    }

    async create(url: Url): Promise<Url>
    {
        // const urlAlreadyExists = await this.urlsRepository.getByOriginalUrl(url.originalUrl);

        // if (urlAlreadyExists != undefined || urlAlreadyExists != null)
        // {
        //     return urlAlreadyExists;
        // }

        var uniqueHash = false;
        var hash = null;
        while (!uniqueHash)
        {
            hash = cryptoRandomString({length: 10, char: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_~'});
            const hashExists = await this.urlsRepository.getByHashForCheck(hash);

            if(!hashExists)
            {
                uniqueHash = true;
            }
        }

        url.hash = hash;
        url.shortUrl = process.env.SITE_URL + hash;

        const response = await this.urlsRepository.createUrl(url);

        await this.urlHashQueue.add('threats', 
        {
            ...url
        }, { delay: 2000 })

        return response;
    }

    async updateToHasThreat(urlHash: string): Promise<Url>
    {
        const url: UpdateUrl = {
            hasThreats: 1,
        };

        return this.urlsRepository.updateUrl(urlHash, url);
    }
}

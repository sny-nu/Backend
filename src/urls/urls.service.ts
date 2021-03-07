import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UrlsRepository } from './urls.repository';
import { Url } from 'src/entities/url.entity';
import * as dotenv from 'dotenv';

const cryptoRandomString = require('crypto-random-string');
dotenv.config();

@Injectable()
export class UrlsService 
{
    constructor(
        @InjectRepository(UrlsRepository)
        private readonly urlsRepository: UrlsRepository,
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
        const urlAlreadyExists = await this.urlsRepository.getByOriginalUrl(url.originalUrl);

        if (urlAlreadyExists != undefined || urlAlreadyExists != null)
        {
            return urlAlreadyExists;
        }

        var uniqueHash = false;
        var hash = null;
        while (!uniqueHash)
        {
            hash = cryptoRandomString({length: 10, type: 'url-safe'});
            const hashExists = await this.urlsRepository.getByHashForCheck(hash);

            if(!hashExists)
            {
                uniqueHash = true;
            }
        }

        url.hash = hash;
        url.shortUrl = process.env.SITE_URL + hash;

        return await this.urlsRepository.createUrl(url);
    }
}

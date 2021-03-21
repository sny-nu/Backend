import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UrlsRepository } from './urls.repository';
import { Url } from 'src/entities/url.entity';
import * as dotenv from 'dotenv';
import { ThreatsService } from 'src/threats/threats.service';

const cryptoRandomString = require('crypto-random-string');
dotenv.config();

@Injectable()
export class UrlsService 
{
    constructor(
        @InjectRepository(UrlsRepository)
        private readonly urlsRepository: UrlsRepository,
        private readonly threatService: ThreatsService
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

        setTimeout(async () => 
        {
            const response = await this.threatService.addThreatsToUrl(url.originalUrl, url.hash);
            if (response == 1)
            {
                url.hasThreats = 1;
                this.urlsRepository.updateUrl(url.hash, url);
            }
        }, 5000);

        return await this.urlsRepository.createUrl(url);
    }
}

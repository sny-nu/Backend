import { BadRequestException, Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Url } from 'src/entities/url.entity';
import { UrlsService } from './urls.service';

@Controller()
export class UrlsController 
{
    constructor(
        private readonly urlsService: UrlsService
    )
    {}

    @Get("v1/url/:hash")
    async getByHash(@Param("hash") hash: string): Promise<Url>
    {
        return await this.urlsService.getByHash(hash);
    }

    @Post("v1/url")
    async create(@Body() url: Url): Promise<Url>
    {
        if(await this.checkUrl(url.originalUrl) == null)
        {
            throw new BadRequestException(`The URL that was provided, '${url.originalUrl}' is not a valid URL`)
        }

        if (!url.originalUrl.includes("https://") && !url.originalUrl.includes("http://")) {
                const completeUrl = "http://" + url;
                url.originalUrl = completeUrl;
        }

        return this.urlsService.create(url);
    }


    async checkUrl(url: string): Promise<RegExpMatchArray>
    {
        const regex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-zA-Z0-9]+([\-\.]{1}[a-zA-Z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
        return url.match(regex);
    }
}
import { BadRequestException, Body, Controller, Get, Param, Post, Headers, Query } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { AnalyticsService } from 'src/analytics/analytics.service';
import { Analytics } from 'src/entities/analytics.entity';
import { Url } from 'src/entities/url.entity';
import { UrlsService } from './urls.service';

@Controller()
export class UrlsController 
{
    constructor(
        private readonly urlsService: UrlsService,
        private readonly analyticsService: AnalyticsService
    )
    {}

    @ApiOkResponse({
        description: 'Get short url on hash',
        type: Url
    })
    @Get("v1/url/:hash")
    async getByHash(@Param("hash") hash: string, @Headers() headers): Promise<Url>
    {
        const url = await this.urlsService.getByHash(hash);

        // Save statistics
        const UA = headers['user-agent'];
        this.analyticsService.addAnalytics(UA, hash);
        
        return url;
    }

    @ApiOkResponse({
        description: 'Post new URL that needs to shortened',
        type: Url
    })
    @Post("v1/url")
    async create(@Body() url: Url): Promise<Url>
    {
        if(await this.checkUrl(url.originalUrl) == null)
        {
            throw new BadRequestException(`The URL that was provided, '${url.originalUrl}' is not a valid URL`)
        }

        if (!url.originalUrl.includes("https://") && !url.originalUrl.includes("http://")) 
        {
            const completeUrl = "http://" + url.originalUrl;
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
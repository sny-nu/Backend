import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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
        return this.urlsService.create(url);
    }
}
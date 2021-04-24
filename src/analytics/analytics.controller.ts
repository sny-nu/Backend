import { Controller, Get, Param } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { UrlStats } from 'src/dto/urlStats.dto';
import { Analytics } from 'src/entities/analytics.entity';
import { AnalyticsService } from './analytics.service';

@Controller()
export class AnalyticsController 
{
    constructor(
        private readonly analyticsService: AnalyticsService
    )
    {}

    @ApiExcludeEndpoint()
    @Get("v1/analytics/:hash")
    async getByUrlHash(@Param("hash") hash: string): Promise<UrlStats>
    {
        const result = await this.analyticsService.getByUrlHash(hash);
        return result;
    }

    @ApiExcludeEndpoint()
    @Get("v1/analytics/:hash/raw")
    async getByUrlHash2(@Param("hash") hash: string): Promise<Analytics[]>
    {
        return await this.analyticsService.getByUrlHashRaw(hash);
    }
}
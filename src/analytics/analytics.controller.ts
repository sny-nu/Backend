import { Controller, Get, Param } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
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
    async getAllByUrlHash(@Param("hash") hash: string): Promise<Analytics[]>
    {
        return await this.analyticsService.getAllByUrlHash(hash);
    }
}
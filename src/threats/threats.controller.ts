import { BadRequestException, Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Threat } from 'src/entities/threat.entity';
import { ThreatsService } from './threats.service';

@Controller()
export class ThreatsController 
{
    constructor(
        private readonly threatsService: ThreatsService
    )
    {}

    @Get("v1/threat/:hash")
    async getAllByUrlHash(@Param("hash") hash: string): Promise<Threat[]>
    {
        return await this.threatsService.getAllByUrlHash(hash);
    }
}
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ThreatsRepository } from './threats.repository';
import { Threat } from 'src/entities/threat.entity';
import { Process, Processor } from '@nestjs/bull';
import { Url } from 'src/entities/url.entity';

import * as dotenv from 'dotenv';
import { Job } from 'bull';
import { UrlsService } from 'src/urls/urls.service';

dotenv.config();

@Processor(process.env.REDIS_QUEUE_NAME)
@Injectable()
export class ThreatsService 
{
    constructor(
        @InjectRepository(ThreatsRepository)
        private readonly threatsRepository: ThreatsRepository,
        private readonly urlsService: UrlsService
    )
    {}

    async getAllByUrlHash(urlHash: string): Promise<Threat[]>
    {
        return await this.threatsRepository.getAllByUrlHash(urlHash);
    }

    @Process('threats')
    async addThreatsToUrl(job: Job<Url>)
    {
        const url = job.data;
        const threats = await this.checkIfUrlIsSafe(url.originalUrl);

        console.log(url);
        
        if (threats.threat != null)
        {
            const threatTypes = threats.threat.threatTypes;
            await this.threatsRepository.addThreatsToUrl(url.hash, threatTypes);
            await this.urlsService.updateToHasThreat(url.hash);
        }
    }

    async checkIfUrlIsSafe(url: string)
    {
        console.log(url);
        const { WebRiskServiceClient } = require("@google-cloud/web-risk");
        const client = new WebRiskServiceClient();

        const request = 
        {
            uri: url,
            threatTypes: [
                "MALWARE",
                "SOCIAL_ENGINEERING",
                "UNWANTED_SOFTWARE",
            ]
        };

        const response = await client.searchUris(request);
        console.log(response);
        return response[0];
    }
}

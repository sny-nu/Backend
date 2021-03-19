import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ThreatsRepository } from './threats.repository';
import { Threat } from 'src/entities/threat.entity';

@Injectable()
export class ThreatsService 
{
    constructor(
        @InjectRepository(ThreatsRepository)
        private readonly threatsRepository: ThreatsRepository,
    )
    {}

    async getAllByUrlHash(urlHash: string): Promise<Threat[]>
    {
        return await this.threatsRepository.getAllByUrlHash(urlHash);
    }

    async addThreatsToUrl(url: string, urlHash: string)
    {
        const threats = await this.checkIfUrlIsSafe(url);
        
        if (threats.threat != null)
        {
            const threatTypes = threats.threat.threatTypes;
            await this.threatsRepository.addThreatsToUrl(urlHash, threatTypes);

            return 1;
        }

        return 0;
    }

    async checkIfUrlIsSafe(url: string)
    {
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
        return response[0];
    }
}

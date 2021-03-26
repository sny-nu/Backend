import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AnalyticsRepository } from './analytics.repository';
import { Analytics } from 'src/entities/analytics.entity';
import * as Bowser from "bowser";
const parser = require('ua-parser-js');

@Injectable()
export class AnalyticsService 
{
    constructor(
        @InjectRepository(AnalyticsRepository) private readonly analyticsRepository: AnalyticsRepository,
    )
    {}

    async getAllByUrlHash(urlHash: string): Promise<Analytics[]>
    {
        return await this.analyticsRepository.getAllByUrlHash(urlHash);
    }

    async addAnalytics(ua: any, urlHash: string) 
    {

        console.log(Bowser);
        const bowser = Bowser.getParser(ua);
        const uaParser = parser(ua);

        const analytics = new Analytics();
        analytics.browser = bowser.getBrowserName();
        analytics.browserVersion = bowser.getBrowserVersion();
        analytics.engine = bowser.getEngineName();
        analytics.os = bowser.getOSName();
        analytics.osVersion = bowser.getOSVersion();
        analytics.device = uaParser.device.model == undefined ? "Unknown" : uaParser.device.model;
        analytics.deviceType = bowser.getPlatformType(); 
        analytics.deviceVendor = bowser.getPlatform().vendor != undefined ? bowser.getPlatform().vendor : (uaParser.device.vendor == undefined ? "Unknown" : uaParser.device.vendor);
        analytics.urlHash = urlHash;

        await this.analyticsRepository.addAnalyticsToUrl(analytics);
    }

    async create(analytics: Analytics): Promise<Analytics>
    {
        return await this.analyticsRepository.addAnalyticsToUrl(analytics);
    }
}

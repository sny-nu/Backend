import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AnalyticsRepository } from './analytics.repository';
import { Analytics } from 'src/entities/analytics.entity';
import * as Bowser from "bowser";
import { UrlStats } from 'src/dto/urlStats.dto';
const parser = require('ua-parser-js');

@Injectable()
export class AnalyticsService 
{
    constructor(
        @InjectRepository(AnalyticsRepository) private readonly analyticsRepository: AnalyticsRepository,
    )
    {}

    async create(analytics: Analytics): Promise<Analytics>
    {
        return await this.analyticsRepository.addAnalyticsToUrl(analytics);
    }

    async getByUrlHash(urlHash: string): Promise<UrlStats>
    {
        const analytics = await this.analyticsRepository.getByUrlHash(urlHash);
        const urlStats = await this.getStats(analytics, urlHash);      

        return urlStats;
    }

    async getStats(analytics: Analytics[], urlHash: string) : Promise<UrlStats>
    {
        const browserUsage = [], 
            deviceTypeUsage = [],
            osUsage = [];

        for await(const { browser, deviceType, os } of analytics) {
            // Browser Usage
            const browserName = (browser == '' || browser == 'Unknown') ? 'Unknown' : browser
            const bIndex = browserUsage.findIndex((x) => { return x.name == browserName });
            bIndex == -1 ? browserUsage.push({ 
                name: browserName, 
                count: 1
            }) : browserUsage[bIndex].count ++;

            // Device type usage
            const deviceTypeName = (deviceType == '' || deviceType == 'Unknown') ? 'Unknown' : 
                                    (deviceType == 'desktop') ? 'Desktop' : 
                                    (deviceType == 'mobile') ? 'Mobile' : 
                                    (deviceType == 'tablet') ? 'Tablet' : deviceType;
            const dIndex = deviceTypeUsage.findIndex((x) => { return x.name == deviceTypeName });
            dIndex == -1 ? deviceTypeUsage.push({ 
                name: deviceTypeName, 
                count: 1
            }) : deviceTypeUsage[dIndex].count ++;

            // OS Type usage
            const osName = (os == '' || os == 'Unknown') ? 'Unknown' : os;
            const oIndex = osUsage.findIndex((x) => { return x.name == osName });
            oIndex == -1 ? osUsage.push({
                name: osName,
                count: 1
            }) : osUsage[oIndex].count ++;
        };

        const date = new Date();
        var currentToday = new Date();

        // Get clicks today
        var startToday = new Date();
        startToday.setHours(2, 0, 0, 0);

        const dataToday = analytics.filter(a => {
            const date = new Date(a.requestedOn);
            return (date >= startToday && date <= currentToday);
        });

        // Get clicks this week
        const dayNumberWeek = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1);
        const startWeek = new Date(date.setDate(dayNumberWeek));
        startWeek.setHours(2, 0, 0, 0);

        const dataWeek = analytics.filter(a => {
            const date = new Date(a.requestedOn);
            return (date >= startWeek && date <= currentToday);
        });

        // Get clicks this month
        const startMonth = new Date(date. getFullYear(), date. getMonth(), 2, -22);        
        
        const dataMonth = analytics.filter(a => {
            const date = new Date(a.requestedOn);
            return (date >= startMonth && date <= currentToday);
        });

        // Average clicks
        const startOfYear = new Date(date.getFullYear(), 0, 1, 1);
        const dayOfYear = (date, startOfYear) => Math.floor((date - startOfYear) / 1000 / 60 / 60 / 24);  
        
        const dayNumber = dayOfYear(date, startOfYear);

        console.log(dayNumber);
        

        const urlStats: UrlStats = {
            urlHash: urlHash,

            clicksToday: dataToday.length,
            clicksThisWeek: dataWeek.length,
            clicksThisMonth: dataMonth.length,
            clicksThisYear: analytics.length,

            mostUsedBrowser: "Coming Soon",
            averageClicksPerDay: analytics.length / dayNumber,

            browserUsage,
            deviceTypeUsage,
            osUsage

        };  

        return urlStats;
    }

    async addAnalytics(ua: any, urlHash: string) 
    {
        const bowser = Bowser.getParser(ua);
        const uaParser = parser(ua);

        const analytics          = new Analytics();
        analytics.browser        = bowser.getBrowserName()     == '' ? "Unknown" : bowser.getBrowserName();
        analytics.browserVersion = bowser.getBrowserVersion()  == '' ? "Unknown" : bowser.getBrowserVersion();
        analytics.engine         = bowser.getEngineName()      == '' ? "Unknown" : bowser.getEngineName();
        analytics.os             = bowser.getOSName()          == '' ? "Unknown" : bowser.getOSName();
        analytics.osVersion      = bowser.getOSVersion()       == '' ? "Unknown" : bowser.getOSVersion();
        analytics.device         = uaParser.device.model       == undefined ? "Unknown" : uaParser.device.model;
        analytics.deviceType     = bowser.getPlatformType()    == '' ? "Unknown" : bowser.getPlatformType(); 
        analytics.deviceVendor   = bowser.getPlatform().vendor != undefined ? bowser.getPlatform().vendor : (uaParser.device.vendor == undefined ? "Unknown" : uaParser.device.vendor);
        analytics.urlHash        = urlHash;

        await this.analyticsRepository.addAnalyticsToUrl(analytics);
    }
}

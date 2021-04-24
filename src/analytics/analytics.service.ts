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

    async getByUrlHashRaw(urlHash: string): Promise<Analytics[]>
    {
        return await this.analyticsRepository.getByUrlHashRaw(urlHash);
    }

    async getByUrlHash(urlHash: string): Promise<UrlStats>
    {
        return await this.analyticsRepository.getByUrlHash(urlHash);
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
        analytics.device         = uaParser.device.model       == undefined || '' ? "Unknown" : uaParser.device.model;
        analytics.deviceType     = bowser.getPlatformType()    == '' ? "Unknown" : bowser.getPlatformType(); 
        analytics.deviceVendor   = bowser.getPlatform().vendor != undefined || '' ? bowser.getPlatform().vendor : (uaParser.device.vendor == undefined ? "Unknown" : uaParser.device.vendor);
        analytics.urlHash        = urlHash;

        await this.analyticsRepository.addAnalyticsToUrl(analytics);
    }

    // DEPRACTED
    // async getStats(analytics: Analytics[], urlHash: string) : Promise<UrlStats>
    // {
    //     let browserUsage = [], 
    //         deviceTypeUsage = [],
    //         osUsage = [];

    //     for await(const { browser, deviceType, os } of analytics) {
    //         // Browser Usage
    //         const browserName = (browser == '' || browser == 'Unknown') ? 'Unknown' : browser
    //         browserUsage = await this.getUsageStats(browserName, browserUsage);

    //         // Device type usage
    //         const deviceTypeName = (deviceType == '' || deviceType == 'Unknown') ? 'Unknown' : 
    //                                 (deviceType == 'desktop') ? 'Desktop' : 
    //                                 (deviceType == 'mobile') ? 'Mobile' : 
    //                                 (deviceType == 'tablet') ? 'Tablet' : deviceType;
    //         deviceTypeUsage = await this.getUsageStats(deviceTypeName, deviceTypeUsage);

    //         // OS Type usage
    //         const osName = (os == '' || os == 'Unknown') ? 'Unknown' : os;
    //         osUsage = await this.getUsageStats(osName, osUsage);
    //     };

    //     const date = new Date();
    //     var currentToday = new Date();

    //     // Get clicks today
    //     var startToday = date;
    //     startToday.setHours(0, 0, 0, 0);

    //     const dataToday = await this.getDataOnPeriod(analytics, startToday, currentToday);

    //     // Get clicks this week
    //     const dayNumberWeek = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1);
    //     const startWeek = new Date(date.setDate(dayNumberWeek));
    //     startWeek.setHours(0, 0, 0, 0);

    //     const dataWeek = await this.getDataOnPeriod(analytics, startWeek, currentToday);

    //     // Get clicks this month
    //     const startMonth = new Date(date. getFullYear(), date. getMonth(), 1); 

    //     const dataMonth = await this.getDataOnPeriod(analytics, startMonth, currentToday);

    //     // Average clicks
    //     const startOfYear = new Date(date.getFullYear(), 0, 1, -1);
    //     const dayOfYear = (date, startOfYear) => Math.floor((date - startOfYear) / 1000 / 60 / 60 / 24);  
    //     const dayNumber = dayOfYear(date, startOfYear);    
        
    //     // Most Used browser
    //     const mostUsedBrowser = browserUsage.reduce((p, c) => p.count > c.count ? p : c);

    //     const urlStats: UrlStats = {
    //         urlHash: urlHash,

    //         clicksToday: dataToday.length,
    //         clicksThisWeek: dataWeek.length,
    //         clicksThisMonth: dataMonth.length,
    //         clicksThisYear: analytics.length,

    //         mostUsedBrowser: mostUsedBrowser.name,
    //         averageClicksPerDay: analytics.length / dayNumber,

    //         browserUsage,
    //         deviceTypeUsage,
    //         osUsage

    //     };  

    //     return urlStats;
    // }

    // async getUsageStats(itemName: string, usageArray: { name: string, count: number }[]) : Promise<object[]>
    // {
    //     const index = usageArray.findIndex((x) => { return x.name == itemName });
    //         index == -1 ? usageArray.push({ 
    //             name: itemName, 
    //             count: 1
    //         }) : usageArray[index].count ++;

    //     return usageArray;
    // }

    // async getDataOnPeriod(fullData: Analytics[], startDate: Date, endDate: Date) : Promise<Analytics[]> {
    //     const data = fullData.filter(a => {
    //         const date = new Date(a.requestedOn);
            
    //         return (date >= startDate && date <= endDate);
    //     });

    //     return data;
    // }
}

export class UrlStats 
{
    urlHash: string;

    clicksToday: number;
    clicksThisWeek: number;
    clicksThisMonth: number;
    clicksThisYear: number;

    averageClicksPerDay: number;

    mostUsedBrowser: string;

    browserUsage: object[];
    deviceTypeUsage: object[];
    osUsage: object[];
}

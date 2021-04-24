import { Between, EntityRepository, Repository } from "typeorm";
import { Analytics } from "src/entities/analytics.entity";
import { NotFoundException } from "@nestjs/common";
import { UrlStats } from "src/dto/urlStats.dto";

@EntityRepository(Analytics)
export class AnalyticsRepository extends Repository<Analytics>
{
    getByUrlHashRaw = async (urlHash: string): Promise<Analytics[]> =>
    {
        const analytics = await this.find({
            where: {
                urlHash: urlHash
            }
        });  

        return analytics;
    }

    getByUrlHash = async (urlHash: string): Promise<UrlStats> => 
    {
        const data = await this.query(`
            SELECT urlHash,
                (SELECT count(*) FROM analytics WHERE urlHash LIKE ? AND CAST(requestedOn as Date) LIKE cast(NOW() as Date)) as clicksToday,
                (SELECT count(*) FROM analytics WHERE urlHash LIKE ? AND requestedOn >= SUBDATE(NOW(), weekday(NOW()))) as clicksThisWeek,
                (SELECT count(*) FROM analytics WHERE urlHash LIKE ? AND requestedOn BETWEEN DATE_FORMAT(NOW() ,'%Y-%m-01') AND NOW()) as clicksThisMonth,
                (SELECT count(*) FROM analytics WHERE urlHash LIKE ? AND requestedOn BETWEEN DATE_FORMAT(NOW() ,'%Y-01-01') AND NOW()) as clicksThisYear,
                (SELECT browser  FROM analytics WHERE urlHash LIKE ? GROUP BY browser ORDER BY COUNT(*) DESC LIMIT 1) AS mostUsedBrowser,
                count(*) / (DATEDIFF(NOW(), url.createdAt)) as averageClicks
            FROM analytics
            JOIN url on url.hash = analytics.urlHash
            WHERE urlHash LIKE ?
            GROUP BY urlHash
        `, [ urlHash, urlHash, urlHash, urlHash, urlHash, urlHash, urlHash ]);

        console.log(data);

        if (data.length == 0) {
            throw new NotFoundException();
        }

        const browserUsage = await this.query(`
            SELECT browser as name, count(browser) as count
            FROM analytics AS A
            JOIN url AS U on A.urlHash = U.hash
            WHERE urlHash LIKE ?
            GROUP BY browser
        `, [ urlHash ]);

        const deviceTypeUsage = await this.query(`
            SELECT deviceType as name, count(deviceType) as count
            FROM analytics
            WHERE urlHash LIKE ?
            GROUP BY deviceType
        `, [ urlHash ]);

        const osUsage = await this.query(`
            SELECT os as name, count(os) as count
            FROM analytics AS A
            JOIN url AS U on A.urlHash = U.hash
            WHERE urlHash LIKE ?
            GROUP BY os
        `, [ urlHash ]);

        const urlStats: UrlStats = {
            urlHash: urlHash,

            clicksToday: data[0].clicksToday,
            clicksThisWeek: data[0].clicksThisWeek,
            clicksThisMonth: data[0].clicksThisMonth,
            clicksThisYear: data[0].clicksThisYear,

            mostUsedBrowser: data[0].mostUsedBrowser,
            averageClicksPerDay: data[0].averageClicks,

            browserUsage,
            deviceTypeUsage,
            osUsage

        };  

        return urlStats;
    }

    addAnalyticsToUrl = async (analytics: Analytics): Promise<Analytics> =>
    {
        return await this.save(analytics);
    }
}
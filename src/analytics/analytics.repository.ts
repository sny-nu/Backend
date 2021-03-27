import { EntityRepository, Repository } from "typeorm";
import { Analytics } from "src/entities/analytics.entity";

@EntityRepository(Analytics)
export class AnalyticsRepository extends Repository<Analytics>
{
    getAllByUrlHash = async (urlHash: string): Promise<Analytics[]> =>
    {
        const analytics = await this.find({
            where: {
                urlHash: urlHash
            }
        });

        return analytics;
    }

    addAnalyticsToUrl = async (analytics: Analytics): Promise<Analytics> =>
    {
        return await this.save(analytics);
    }
}
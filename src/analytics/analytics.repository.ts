import { Between, EntityRepository, Repository } from "typeorm";
import { Analytics } from "src/entities/analytics.entity";
import { NotFoundException } from "@nestjs/common";

export const AfterDate = (fromDate: Date, tillDate) => Between(fromDate, tillDate);

@EntityRepository(Analytics)
export class AnalyticsRepository extends Repository<Analytics>
{
    getByUrlHash = async (urlHash: string): Promise<Analytics[]> =>
    {
        const tillDate = new Date();
        const fromDate = new Date(new Date().getFullYear(), 0, 1, 1);

        const analytics = await this.find({
            where: {
                urlHash: urlHash,
                requestedOn: AfterDate(fromDate, tillDate)
            }
        });  
                
        if (analytics.length == 0) {
            throw new NotFoundException();
        }

        return analytics;
    }

    addAnalyticsToUrl = async (analytics: Analytics): Promise<Analytics> =>
    {
        return await this.save(analytics);
    }
}
import { NotFoundException } from "@nestjs/common";
import { EntityRepository, IsNull, Repository, UpdateResult } from "typeorm";
import { Threat } from "src/entities/threat.entity";

@EntityRepository(Threat)
export class ThreatsRepository extends Repository<Threat>
{
    getAllByUrlHash = async (urlHash: string): Promise<Threat[]> =>
    {
        const threats = await this.find({
            where: {
                urlHash: urlHash
            }
        });

        return threats;
    }

    addThreatsToUrl = async (urlHash: string, threatTypes: string[]) =>
    {
        threatTypes.forEach(async (threat) => {
            const addThreat = {
                urlHash: urlHash,
                type: threat
            }

            await this.save(addThreat);;
        });
    }
}
import { NotFoundException } from "@nestjs/common";
import { Url } from "src/entities/url.entity";
import { UpdateUrl } from "src/entities/updateEntities/updateUrl.entity";
import { EntityRepository, IsNull, Repository, UpdateResult } from "typeorm";

@EntityRepository(Url)
export class UrlsRepository extends Repository<Url>
{
    getAll = async (): Promise<Url[]> => 
    {
        return await this.find({
            where: {
                deletedAt: IsNull()
            }
        });
    };

    getById = async (urlId: number): Promise<Url> =>
    {
        const url = await this.findOne({
            where: {
                id: urlId
            }
        });

        if (!url)
        {
            throw new NotFoundException();
        }

        return url;
    }

    getByHash = async (urlHash: string): Promise<Url> =>
    {
        const url = await this.findOne({
            where: {
                hash: urlHash
            }
        });

        if (!url)
        {
            throw new NotFoundException();
        }

        return url;
    }

    getByHashForCheck = async (urlHash: string): Promise<Url> =>
    {
        return await this.findOne({
            where: {
                hash: urlHash
            }
        });
    }

    getByOriginalUrl = async (originalUrl: string): Promise<Url> =>
    {
        return await this.findOne({
            where: {
                originalUrl: originalUrl
            }
        });
    }

    createUrl = async (url: Url): Promise<Url> =>
    {
        return this.save(url);
    }

    updateUrl = async (urlId: number, url: Url): Promise<Url> =>
    {
        return await this.save({ ...url, id: urlId });
    }

    deleteUrl = async (urlId: number): Promise<UpdateResult> => 
    {
        const deletedUrlData: UpdateUrl = {
            deletedAt: new Date(),
        };

        return this.update({ id: urlId}, deletedUrlData)
    }
}
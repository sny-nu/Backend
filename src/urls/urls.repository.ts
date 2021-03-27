import { NotFoundException } from "@nestjs/common";
import { Url } from "src/entities/url.entity";
import { UpdateUrl } from "src/entities/extra/updateUrl.entity";
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
            },
            relations: ['threats']
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

    updateUrl = async (urlHash: string, url: UpdateUrl): Promise<Url> =>
    {
        return await this.save({ ...url, hash: urlHash });
    }

    deleteUrl = async (urlHash: string): Promise<UpdateResult> => 
    {
        const deletedUrlData: UpdateUrl = {
            deletedAt: new Date(),
        };

        return this.update({ hash: urlHash }, deletedUrlData)
    }
}
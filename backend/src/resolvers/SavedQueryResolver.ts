import {Resolver, Arg, Query, Mutation, Ctx} from 'type-graphql';
import axios from 'axios';
import { TestUrlResponse } from '../types/TestUrlResponse';
import { EStatus } from "../types/EStatus";
import { NewQueryInput } from "../types/NewQueryInput";
import {User} from "../entity/User";
import { SavedQuery } from '../entity/SavedQuery';
import { AppContext } from '../types/AppContext';

@Resolver()
class SavedQueryResolver {

    /**
     * Test a URL
     * @param url
     */
    @Query(() => TestUrlResponse)
    async testUrl(
        @Arg('url') url: string
    ): Promise<TestUrlResponse> {
        const startTime = Date.now();
        let status = EStatus.Error;
        let statusCode = 0;
        let statusMessage = 'Unknown Error';

        try {
            const response = await axios.get(url);
            const responseTime = Date.now() - startTime;
            statusCode = response.status;
            statusMessage = response.statusText;

            if (statusCode >= 200 && statusCode < 300 && responseTime < 1000) {
                status = EStatus.Success;
            } else if (statusCode >= 200 && statusCode < 500 && responseTime > 1000) {
                status = EStatus.Warning;
            }
            else if (statusCode >= 500 ) {
                status = EStatus.Error;
            }

            return {
                url,
                status,
                responseTime,
                statusCode,
                statusMessage,
            };
        } catch (error) {
            const responseTime = Date.now() - startTime;
            if (axios.isAxiosError(error)) {
                statusCode = error.response?.status || 500;
                statusMessage = error.message;
            }

            return {
                url,
                status,
                responseTime,
                statusCode,
                statusMessage,
            };
        }
    }

    /**
     * Add a new query
     * @param data
     * @param ctx
     */
    @Mutation(() => String)
    async addQuery(
        @Arg('data') data: NewQueryInput,
        @Ctx() ctx: AppContext
    ): Promise<string> {

        // Extract userId from context
        const userFromDB = await User.findOneByOrFail({ email: ctx.email })
        if(!userFromDB) {
            throw new Error('User not authenticated');
        }

        const query = SavedQuery.create({
            url: data.url,
            name: data.name,
            frequency: data.frequency,
            createdAt: new Date(),
            updatedAt: new Date(),
            user: userFromDB,
        });

        await query.save();
        return "Query saved";
    }
}

export default SavedQueryResolver;

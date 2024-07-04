import {Resolver, Arg, Query, Mutation, Ctx} from 'type-graphql';
import { TestUrlResponse } from '../types/TestUrlResponse';
import { NewQueryInput } from "../types/NewQueryInput";
import {User} from "../entity/User";
import { SavedQuery } from '../entity/SavedQuery';
import { AppContext } from '../types/AppContext';
import { RequestTester } from '../helpers/RequestTester';

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
        return RequestTester.testRequest(url);
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

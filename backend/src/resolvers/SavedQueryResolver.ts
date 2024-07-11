import {Arg, Authorized, Ctx, Mutation, Query, Resolver} from 'type-graphql';
import {TestUrlResponse} from '../types/TestUrlResponse';
import {NewQueryInput} from "../types/NewQueryInput";
import {User} from "../entity/User";
import {SavedQuery} from '../entity/SavedQuery';
import {AppContext} from '../types/AppContext';
import {RequestTester} from '../helpers/RequestTester';
import {startNewQueryWorker} from '../workers/savedQueriesWorker';
import {SavedQueryWithLastStatus} from '../types/SavedQueryWithLastStatus';
import {Log} from '../entity/Log';

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
            frequency: parseInt(data.frequency),
            createdAt: new Date(),
            updatedAt: new Date(),
            user: userFromDB,
        });

        await query.save();

        // Start the worker for the new query
        await startNewQueryWorker(query);

        return "Query saved";
    }

    /**
     * Get all queries for the current user
     */
    @Authorized()
    @Query(() => [SavedQueryWithLastStatus])
    async getSavedQueries(
        @Ctx() ctx: AppContext
    ): Promise<SavedQueryWithLastStatus[]> {

        const userFromDB = await User.findOneByOrFail({ email: ctx.email } );

        if (userFromDB === undefined) {
            throw new Error('User not authenticated');
        }

        const savedQueries = await SavedQuery.find({ where: { user: userFromDB } });

        return await Promise.all(savedQueries.map(async (query) => {
            const lastLog = await Log.findOne({
                where: {query: query},
                order: {date: "DESC"}
            });

            return {
                ...query,
                lastStatus: lastLog || null
            } as SavedQueryWithLastStatus;
        }));
    }

    /**
     * Get the last 50 logs for a query by query ID
     */
    @Query(() => [Log])
    async getLogsForSavedQuery(
        @Arg('savedQueryId') queryId: number,
    ): Promise<Log[]> {
        // Check if the query exists
        const query = await SavedQuery.findOneOrFail({where: {_id: queryId}});

        // If not, return an empty array (shouldn't happen)
        if(!query) return [];

        // There should always be logs for a query, as we create one when the query is created
        return await Log.find({where: {query: query}, take: 50, order: {date: 'DESC'}});
    }

}

export default SavedQueryResolver;

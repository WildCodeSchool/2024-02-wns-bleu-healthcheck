import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { TestUrlResponse } from "../types/TestUrlResponse";
import { NewQueryInput } from "../types/NewQueryInput";
import { User } from "../entity/User";
import { SavedQuery } from "../entity/SavedQuery";
import { AppContext } from "../types/AppContext";
import { RequestTester } from "../helpers/RequestTester";
import {
  startNewQueryWorker,
  stopQueryWorker,
} from "../workers/savedQueriesWorker";
import { Log } from "../entity/Log";

@Resolver()
class SavedQueryResolver {
  /**
   * Test a URL
   * @param url
   */
  @Query(() => TestUrlResponse)
  async testUrl(@Arg("url") url: string): Promise<TestUrlResponse> {
    return RequestTester.testRequest(url);
  }

  /**
   * Add a new query
   * @param data
   * @param ctx
   */
  @Mutation(() => String)
  async addQuery(
    @Arg("data") data: NewQueryInput,
    @Ctx() ctx: AppContext
  ): Promise<string> {
    // Extract userId from context
    const userFromDB = await User.findOneByOrFail({ email: ctx.email });
    if (!userFromDB) {
      throw new Error("User not authenticated");
    }

    const query = SavedQuery.create({
      url: data.url,
      name: data.name,
      frequency: parseInt(data.frequency),
      createdAt: new Date(),
      updatedAt: new Date(),
      user: userFromDB,
      queryOrder: 0,
    });

    const savedQuery = await query.save();

    savedQuery.queryOrder = savedQuery._id;

    await savedQuery.save();
    // Start the worker for the new query
    await startNewQueryWorker(query);

    return "Query saved";
  }

  /**
   * Get all queries for the current user
   */
  @Authorized()
  @Query(() => [SavedQuery])
  async getSavedQueries(@Ctx() ctx: AppContext): Promise<SavedQuery[]> {
    const userFromDB = await User.findOneByOrFail({ _id: ctx.userId });

    if (userFromDB === undefined) {
      throw new Error("User not authenticated");
    }

    return await SavedQuery.find({ where: { user: userFromDB } });
  }

  /**
   * Get the last 50 logs for a query by query ID
   */
  @Query(() => [Log])
  async getLogsForSavedQuery(
    @Arg("savedQueryId") queryId: number
  ): Promise<Log[]> {
    // Check if the query exists
    const query = await SavedQuery.findOneOrFail({ where: { _id: queryId } });
    // If not, return an empty array (shouldn't happen)
    if (!query) return [];

    // There should always be logs for a query, as we create one when the query is created
    return await Log.find({
      relations: ["query"],
      where: { query: { _id: queryId } },
      take: 50,
      order: { date: "DESC" },
    });
  }

  /**
   * Delete a query by ID
   * @param queryId
   * @param ctx
   */
  @Authorized()
  @Mutation(() => String)
  async deleteQuery(
    @Arg("queryId") queryId: number,
    @Ctx() ctx: AppContext
  ): Promise<string> {
    const userFromDB = await User.findOneByOrFail({ _id: ctx.userId });

    if (!userFromDB) {
      throw new Error("User not authenticated");
    }

    // Find the query and check if it belongs to the authenticated user
    const query = await SavedQuery.findOne({
      where: { _id: queryId, user: userFromDB },
    });

    if (!query) {
      return "Query not found or not authorized to delete";
    }

    // Remove the worker associated to the query
    stopQueryWorker(queryId);

    // Remove the logs associated to the query before deleting it
    await Log.delete({ query: { _id: queryId } });

    await query.remove();
    return "Query deleted";
  }

  /**
   * Edit a query by ID
   */
  @Authorized()
  @Mutation(() => String)
  async editQuery(
    @Arg("queryId") queryId: number,
    @Arg("name") name: string,
    @Arg("frequency") frequency: number,
    @Ctx() ctx: AppContext
  ): Promise<string> {
    if (name.length === 0 || frequency <= 0 || frequency > 60) {
      throw new Error("Invalid name or frequency");
    }

    const userFromDB = await User.findOneByOrFail({ _id: ctx.userId });

    if (!userFromDB) {
      throw new Error("User not authenticated");
    }

    // Find the query and check if it belongs to the authenticated user
    const query = await SavedQuery.findOne({
      where: { _id: queryId, user: userFromDB },
    });

    if (!query) {
      return "Query not found or not authorized to update";
    }
    query.name = name;
    query.frequency = frequency;
    query.updatedAt = new Date();

    await query.save();

    // Remove the worker associated to the query
    stopQueryWorker(queryId);

    // Start the worker for the updated query
    await startNewQueryWorker(query);

    return "Query updated";
  }

  @Authorized()
  @Mutation(() => String)
  async updateQueryOrder(
    @Arg("queriesId", () => [Number]) queriesId: number[],
    @Ctx() ctx: AppContext
  ): Promise<string> {
    const userFromDB = await User.findOneByOrFail({ _id: ctx.userId });

    if (!userFromDB) {
      throw new Error("User not authenticated");
    }
    queriesId.map(async (queryId, index) => {
      const savedQuery = await SavedQuery.findOne({
        where: { _id: queryId, user: userFromDB },
      });

      if (!savedQuery) {
        throw new Error("Query not found or not authorized to update");
      }
      savedQuery.queryOrder = index;
      await savedQuery.save();
    });

    return "Query order updated successfully";
  }
}

export default SavedQueryResolver;

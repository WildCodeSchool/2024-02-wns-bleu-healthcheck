import { CronJob } from "cron";
import { dataSource} from "../config/db";
import { SavedQuery } from '../entity/SavedQuery';
import LogResolver from "../resolvers/LogResolver";

/**
 * Execute a saved query
 * @param savedQuery
 */
export const executeQuery = async (savedQuery: SavedQuery) => {
    await LogResolver.logUrlTest(savedQuery);
    return;
};

/**
 * Schedule a query to run at its specified frequency in minutes
 * @param savedQuery
 */
export const scheduleQuery = (savedQuery: SavedQuery) => {
    const job = new CronJob(`*/${savedQuery.frequency} * * * *`, () => {
        executeQuery(savedQuery);
    });
    job.start();
};

/**
 * Start the saved queries worker
 */
export const startSavedQueriesWorker = async () => {
    const savedQueryRepository = dataSource.getRepository(SavedQuery);
    const savedQueries = await savedQueryRepository.find();

    for (const savedQuery of savedQueries) {
        await executeQuery(savedQuery);
        scheduleQuery(savedQuery);
    }
};

/**
 * Start the worker for a new saved query
 */
export const startNewQueryWorker = async (savedQuery: SavedQuery) => {
    await executeQuery(savedQuery);
    scheduleQuery(savedQuery);
}

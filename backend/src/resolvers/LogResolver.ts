import {Resolver} from 'type-graphql';
import {SavedQuery} from "../entity/SavedQuery";
import {RequestTester} from "../helpers/RequestTester";
import {Log} from "../entity/Log";

@Resolver()
class LogResolver {
    /**
     * Function called by the QueryResolver to test an url and store the result in the database
     */
    static logUrlTest = async (query: SavedQuery) => {

        const testResult = await RequestTester.testRequest(query.url);

        const log = Log.create({
            query: query,
            date: new Date(),
            status: testResult.testStatus.status,
            response_time: testResult.testStatus.response_time,
            status_code: testResult.testStatus.status_code,
            status_message: testResult.testStatus.status_message,
        });

        await Log.save(log);
        return log;
    }

}

export default LogResolver;

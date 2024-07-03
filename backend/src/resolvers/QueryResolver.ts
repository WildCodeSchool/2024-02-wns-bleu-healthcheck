import { Resolver, Arg, Query } from 'type-graphql';
import axios from 'axios';
import { TestUrlResponse } from '../types/TestUrlResponse';

@Resolver()
class QueryResolver {
    @Query(() => TestUrlResponse)
    async testUrl(
        @Arg('url') url: string
    ): Promise<TestUrlResponse> {
        const startTime = Date.now();
        let status = 0;
        let statusCode = 0;
        let statusMessage = 'Unknown Error';

        try {
            const response = await axios.get(url);
            const responseTime = Date.now() - startTime;
            statusCode = response.status;
            statusMessage = response.statusText;

            if (statusCode >= 200 && statusCode < 300 && responseTime < 1000) {
                status = 2;
            } else if (statusCode >= 200 && statusCode < 300 && responseTime > 1000) {
                status = 1;
            }
            else if (statusCode >= 400 ) {
                status = 0;
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
}

export default QueryResolver;

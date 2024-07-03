import { Resolver, Arg, Query } from 'type-graphql';
import axios from 'axios';
import { TestUrlResponse } from '../types/TestUrlResponse';
import { EStatus } from "../types/EStatus";

@Resolver()
class QueryResolver {
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
}

export default QueryResolver;

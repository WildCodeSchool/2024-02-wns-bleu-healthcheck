import { gql } from "@apollo/client";

export const TEST_URL = gql`
query TestUrl($url: String!) {
    testUrl(url: $url) {
        responseTime
        status
        statusCode
        statusMessage
    }
}`;
import { gql } from "@apollo/client";

export const TEST_URL = gql`
query TestUrl($url: String!) {
    testUrl(url: $url) {
        date
        response_time
        status
        status_code
        status_message
    }
}`;

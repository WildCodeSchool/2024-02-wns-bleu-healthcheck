import { gql } from "@apollo/client";

export const TEST_URL = gql`
query TestUrl($url: String!) {
    testUrl(url: $url) {
        url
        lastStatus {
            date
            status
            response_time
            status_code
            status_message
        }
    }
}`;

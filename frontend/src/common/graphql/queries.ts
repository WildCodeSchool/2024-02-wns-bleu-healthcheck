import {gql} from "@apollo/client";

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

export const WHO_AM_I = gql`
  query WhoAmI {
    whoAmI {
      email
      role
      name
      isLoggedIn
    }
  }
`;

export const LOGIN = gql`
  query Login( $email: String!, $password: String!,) {
    login( email: $email, password: $password)
  }
`;

export const LOGOUT = gql`
  query Logout {
    logout
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($email: String!, $name: String!, $password: String!,) {
    createUser(email: $email, name: $name, password: $password)
  }
`;

export const CREATE_SAVED_QUERY = gql`
    mutation CreateSavedQuery($data: NewQueryInput!) {
        addQuery(data: $data)
    }
`;

export const GET_SAVED_QUERIES = gql`
    query GetSavedQueries {
        getSavedQueries {
        _id
        name
        url
        frequency
        lastStatus {
            date
            status
            response_time
            status_code
            status_message
        }
        }
    }
`;

export const GET_LOGS = gql`
    query GetLogs($savedQueryId: Float!) {
        getLogsForSavedQuery(savedQueryId: $savedQueryId) {
            date
            response_time
            status
            status_code
            status_message
        }
    }
`;

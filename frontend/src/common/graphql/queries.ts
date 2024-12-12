import { gql } from "@apollo/client";

export const TEST_URL = gql`
    query TestUrl($url: String!) {
        testUrl(url: $url) {
            url
            testStatus {
                date
                status
                response_time
                status_code
                status_message
            }
        }
    }
`;

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
    query Login($email: String!, $password: String!) {
        login(email: $email, password: $password)
    }
`;

export const LOGOUT = gql`
    query Logout {
        logout
    }
`;

export const CREATE_USER = gql`
    mutation CreateUser($email: String!, $name: String!, $password: String!) {
        createUser(email: $email, name: $name, password: $password)
    }
`;

export const EDIT_USER = gql`
    mutation EditUser($newEmail: String!, $name: String!) {
        editUser(newEmail: $newEmail, name: $name)
    }
`;

export const EDIT_USER_PASSWORD = gql`
    mutation editUserPassword($oldPassword: String!, $newPassword: String!) {
        editUserPassword(oldPassword: $oldPassword, newPassword: $newPassword)
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
            queryOrder
        }
    }
`;

export const DELETE_SAVED_QUERY = gql`
    mutation Mutation($queryId: Float!) {
        deleteQuery(queryId: $queryId)
    }
`;

export const GET_LOGS = gql`
    query GetLogs($savedQueryId: Float!) {
        getLogsForSavedQuery(savedQueryId: $savedQueryId) {
            _id
            date
            response_time
            status
            status_code
            status_message
        }
    }
`;

export const EDIT_SAVED_QUERY = gql`
    mutation EditSavedQuery(
        $queryId: Float!
        $name: String!
        $frequency: Float!
    ) {
        editQuery(queryId: $queryId, name: $name, frequency: $frequency)
    }
`;

export const UPDATE_QUERY_ORDER = gql`
    mutation Mutation($queriesId: [Float!]!) {
        updateQueryOrder(queriesId: $queriesId)
    }
`;

export const ADD_PREMIUM_ROLE = gql`
    mutation addPremiumRole {
        addPremiumRole
    }
`;

export const REMOVE_PREMIUM_ROLE = gql`
    mutation removePremiumRole {
        removePremiumRole
    }
`;

export const CREATE_PAYMENT_INTENT = gql`
    mutation CreatePaymentIntent($amount: Float!) {
        createPaymentIntent(amount: $amount) {
            clientSecret
        }
    }
`;

export const GET_GROUPS = gql`
    query GetGroups {
        getGroups {
            _id
            name
            users {
                _id
                name
                email
            }
        }
    }
`;

export const GET_GROUP_BY_ID = gql`
    query GetGroupById($id: Float!) {
        getGroupById(id: $id) {
            _id
            name
            users {
                _id
                name
                email
            }
        }
    }
`;

export const CREATE_GROUP = gql`
    mutation CreateGroup($name: String!, $emails: [String!]!) {
        createGroup(name: $name, emails: $emails)
    }
`;

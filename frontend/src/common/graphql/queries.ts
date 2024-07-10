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

export const CREATE_USER = gql`
  mutation CreateUser($email: String!, $name: String!, $password: String!,) {
    createUser(email: $email, name: $name, password: $password)
  }
`;
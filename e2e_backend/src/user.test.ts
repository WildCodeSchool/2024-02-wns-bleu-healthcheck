import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  gql,
} from "@apollo/client/core";

const client = new ApolloClient({
  link: new HttpLink({
    uri: "http://apigateway/api",
    fetch,
  }),
  cache: new InMemoryCache(),
});

export const CREATE_USER = gql`
  mutation CreateUser($email: String!, $name: String!, $password: String!) {
    createUser(email: $email, name: $name, password: $password)
  }
`;
export const CREATE_SAVED_QUERY = gql`
  mutation CreateSavedQuery($data: NewQueryInput!) {
    addQuery(data: $data)
  }
`;
export const LOGIN = gql`
  query Login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;
describe("UserResolver", () => {
  it("should create a user", async () => {
    const result = await client.mutate({
      mutation: CREATE_USER,
      variables: {
        email: "test100@gmail.com",
        name: "test",
        password: "test1234",
      },
    });
    expect(result.data).toStrictEqual({ createUser: "User created" });
  });
  it("should not login a user with wrong password", async () => {
    const result = await client.query({
      query: LOGIN,
      variables: {
        email: "test100@gmail.com",
        password: "wrongpassword",
      },
    });
    expect(result.data).toStrictEqual({ login: "Login failed" });
  });
  it("should login a user", async () => {
    const result = await client.query({
      query: LOGIN,
      variables: {
        email: "test100@gmail.com",
        password: "test1234",
      },
    });
    expect(result.data).toStrictEqual({
      login: "Login successful",
    });
  });
});

describe("SavedQueryResolver", () => {
  it("should save a query", async () => {
    const result = await client.mutate({
      mutation: CREATE_SAVED_QUERY,
      variables: {
        data: {
          url: "http://google.com",
          name: "google",
          frequency: "60",
        },
      },
    });
    expect(result.data).toStrictEqual({ addQuery: "Query saved" });
  });
});

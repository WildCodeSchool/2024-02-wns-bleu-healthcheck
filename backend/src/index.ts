import "dotenv/config";

import "reflect-metadata";
import {dataSource} from "./config/db";
import {buildSchema} from "type-graphql";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from '@apollo/server/standalone';
import UserResolver from "./resolvers/UserResolver";
import SavedQueryResolver from "./resolvers/SavedQueryResolver";
import LogResolver from "./resolvers/LogResolver";
import {authChecker} from "./helpers/authChecker";

const start = async () => {

  await dataSource.initialize();

  const schema = await buildSchema({
    resolvers: [UserResolver, SavedQueryResolver, LogResolver],
    authChecker,
  });

  const server = new ApolloServer({schema});

  // Passing an ApolloServer instance to the `startStandaloneServer` function:
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log(`🚀  Server ready at: ${url}`);
}

start();

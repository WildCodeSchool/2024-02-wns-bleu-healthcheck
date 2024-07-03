import "dotenv/config";

import "reflect-metadata";
import {dataSource} from "./config/db";
import {buildSchema} from "type-graphql";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from '@apollo/server/standalone';
import UserResolver from "./resolvers/UserResolver";
import QueryResolver from "./resolvers/QueryResolver";
import LogResolver from "./resolvers/LogResolver";

const start = async () => {

  await dataSource.initialize();

  const schema = await buildSchema({
    resolvers: [UserResolver, QueryResolver, LogResolver],
    // authChecker: ({context}, roles) => {
    //   // Check user
    //   if (!context.email) {
    //     // No user, restrict access
    //     return false;
    //   }
    //
    //   // Check '@Authorized()'
    //   if (roles.length === 0) {
    //     // Only authentication required
    //     return true;
    //   }
    //
    //   // Check '@Authorized(...)' roles inclues the role of user
    //   if (roles.includes(context.role)) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // }
  });

  const server = new ApolloServer({schema});

  // Passing an ApolloServer instance to the `startStandaloneServer` function:
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log(`🚀  Server ready at: ${url}`);
}

start();

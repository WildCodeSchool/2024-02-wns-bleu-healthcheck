import "dotenv/config";

import "reflect-metadata";
import {dataSource} from "./config/db";
import {buildSchema} from "type-graphql";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from '@apollo/server/standalone';
import UserResolver from "./resolvers/UserResolver";
import SavedQueryResolver from "./resolvers/SavedQueryResolver";
import LogResolver from "./resolvers/LogResolver";
import PaymentResolver from "./resolvers/PaymentResolver";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import { startSavedQueriesWorker } from './workers/savedQueriesWorker';

const start = async () => {

  await dataSource.initialize();

  const schema = await buildSchema({
    resolvers: [UserResolver, SavedQueryResolver, LogResolver, PaymentResolver],
    authChecker: ({context}, roles) => {
      // Check user
      if (!context.email) {
        // No user, restrict access
        return false;
      }

      // Check '@Authorized()'
      if (roles.length === 0) {
        // Only authentication required
        return true;
      }

      // Check '@Authorized(...)' roles includes the role of user
      return roles.includes(context.role);
    }
  });

  const server = new ApolloServer({schema});

  // Passing an ApolloServer instance to the `startStandaloneServer` function:
  await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async ({ req, res }) => {
      if (process.env.JWT_SECRET_KEY === undefined) {
        throw new Error("NO JWT SECRET KEY CONFIGURED");
      }

      const cookies = cookie.parse(req.headers.cookie || "");

      if (cookies.token) {
        const payload = jwt.verify(
            cookies.token,
            process.env.JWT_SECRET_KEY
        ) as jwt.JwtPayload;

        if (payload) {
          return { ...payload, res: res };
        }
      }
      return { res: res };
    },
  });

  // Start the saved queries worker
  await startSavedQueriesWorker();

  console.log(`🚀  Server ready at: http://localhost:7001/api`);
}

start();

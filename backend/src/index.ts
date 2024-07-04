import "dotenv/config";

import "reflect-metadata";
import {dataSource} from "./config/db";
import {buildSchema} from "type-graphql";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from '@apollo/server/standalone';
import UserResolver from "./resolvers/UserResolver";
import SavedQueryResolver from "./resolvers/SavedQueryResolver";
import LogResolver from "./resolvers/LogResolver";
import jwt from "jsonwebtoken";
import setCookieParser from "set-cookie-parser";

const start = async () => {

  await dataSource.initialize();

  const schema = await buildSchema({
    resolvers: [UserResolver, SavedQueryResolver, LogResolver],
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
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async ({ req, res }) => {
      if (process.env.JWT_SECRET_KEY === undefined) {
        throw new Error("NO JWT SECRET KEY CONFIGURED");
      }
      const cookies = setCookieParser.parse(req.headers.cookie ?? "", {
        map: true,
      });

      if (cookies.token && cookies.token.value) {
        const payload = jwt.verify(
            cookies.token.value,
            process.env.JWT_SECRET_KEY
        ) as jwt.JwtPayload;
        if (payload) {
          return { ...payload, res: res };
        }
      }
      return { res: res };
    },
  });

  console.log(`🚀  Server ready at: ${url}`);
}

start();

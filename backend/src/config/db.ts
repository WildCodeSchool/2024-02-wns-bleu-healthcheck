import { DataSource } from "typeorm";
import { User } from "../entity/User";
import { SavedQuery } from "../entity/SavedQuery";
import { Log } from "../entity/Log";
import * as dotenv from "dotenv";
import { Group } from "../entity/Group";

dotenv.config();

const isProd = process.env.NODE_ENV === "production";
const databaseHost = isProd
  ? process.env.DATABASE_HOST_PROD
  : process.env.DATABASE_HOST_DEV;

export const dataSource = new DataSource({
  type: "postgres",
  host: databaseHost,
  port: parseInt(process.env.DATABASE_PORT!),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: true,
  logging: ["error", "query"],
  entities: [User, SavedQuery, Log, Group],
});

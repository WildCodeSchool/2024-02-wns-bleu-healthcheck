import {DataSource} from "typeorm";
import {User} from "./src/Entity/User";
import {Query} from "./src/Entity/Query";
import {Log} from "./src/Entity/Log";

export const dataSource = new DataSource({
    type: "postgres",
    host: "db",
    port: 5432,
    username: "postgres",
    password: "example",
    database: "postgres",
    synchronize: true,
    logging: ["error", "query"],
    entities: [User, Query, Log],
});

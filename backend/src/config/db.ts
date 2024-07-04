import {DataSource} from "typeorm";
import {User} from "../entity/User";
import {SavedQuery} from "../entity/SavedQuery";
import {Log} from "../entity/Log";

export const dataSource = new DataSource({
    type: "postgres",
    host: "db",
    port: 5432,
    username: "postgres",
    password: "password",
    database: "postgres",
    synchronize: true,
    logging: ["error", "query"],
    entities: [User, SavedQuery, Log],
});

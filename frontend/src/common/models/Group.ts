import { User } from "./User";

export type Group = {
    _id: number;
    name: string;
    users: User[];
};

import { ObjectType, Field } from "type-graphql";
import { SavedQuery } from "../entity/SavedQuery";
import { Log } from "../entity/Log";

@ObjectType()
export class SavedQueryWithLastStatus extends SavedQuery {
    @Field(() => Log, { nullable: true })
    lastStatus?: Log;
}

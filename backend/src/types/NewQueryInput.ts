import { InputType, Field } from 'type-graphql';

@InputType()
export class NewQueryInput {
    @Field()
    url: string;

    @Field()
    name: string;

    @Field()
    frequency: string;
}

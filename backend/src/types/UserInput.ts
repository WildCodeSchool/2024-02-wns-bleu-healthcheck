import { InputType, Field } from 'type-graphql';

@InputType()
export class RegisterInput {
    @Field()
    email: string;

    @Field()
    name: string;

    @Field()
    password: string;
}

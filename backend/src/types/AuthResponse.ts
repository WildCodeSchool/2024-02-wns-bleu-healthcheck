import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class AuthResponse {
    @Field()
    token: string;
}

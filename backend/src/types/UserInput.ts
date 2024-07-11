import { InputType, Field, ObjectType } from 'type-graphql';

@InputType()
export class RegisterInput {
    @Field()
    email: string;

    @Field()
    name: string;

    @Field()
    password: string;
}

@ObjectType()
export class UserInfo {
    @Field()
    isLoggedIn: boolean;
    @Field({ nullable: true })
    email: string;
    @Field({ nullable: true })
    role: string;
}

import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class PaymentIntentResponse {
    @Field()
    clientSecret: string;
}

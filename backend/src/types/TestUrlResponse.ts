import { ObjectType, Field, Int } from 'type-graphql';

@ObjectType()
export class TestUrlResponse {
    @Field()
    url: string;

    @Field(() => Int)
    status: number; // 0: Error (red), 1: Warning (orange), 2: Success (green)

    @Field(() => Int)
    responseTime: number;

    @Field(() => Int)
    statusCode: number;

    @Field()
    statusMessage: string;
}

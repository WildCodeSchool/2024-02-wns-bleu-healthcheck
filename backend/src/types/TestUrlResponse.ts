import { ObjectType, Field, Int } from 'type-graphql';

@ObjectType()
class TestStatusResponse {

    @Field()
    date: Date;

    @Field(() => Int)
    status: number; // 0: Error (red), 1: Warning (orange), 2: Success (green)

    @Field(() => Int)
    response_time: number;

    @Field(() => Int)
    status_code: number;

    @Field()
    status_message: string;
}


@ObjectType()
export class TestUrlResponse {
    @Field()
    url: string;

    @Field()
    testStatus: TestStatusResponse;
}

import { Resolver, Query } from 'type-graphql';

@Resolver()
class QueryResolver {
    @Query(() => String)
    hello(): string {
        return 'Hello World';
    }
}

export default QueryResolver;

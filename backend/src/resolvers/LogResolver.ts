import { Resolver, Query } from 'type-graphql';

@Resolver()
class LogResolver {
    @Query(() => String)
    hello(): string {
        return 'Hello World';
    }
}

export default LogResolver;

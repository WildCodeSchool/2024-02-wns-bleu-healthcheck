import { Resolver, Query } from 'type-graphql';

@Resolver()
class UserResolver {
    @Query(() => String)
    hello(): string {
        return 'Hello World';
    }
}

export default UserResolver;

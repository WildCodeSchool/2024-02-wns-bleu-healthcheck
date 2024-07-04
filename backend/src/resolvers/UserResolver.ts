import "dotenv/config";

import {Resolver, Mutation, Arg, Query, Ctx} from 'type-graphql';
import { User } from '../entity/User';
import { RegisterInput } from '../types/UserInput';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

@Resolver()
class UserResolver {
    @Mutation(() => String)
    async createUser(
        @Arg('data') data: RegisterInput
    ): Promise<String> {

        // Check if email already exists
        const emailExists = await User.findOne({ where: { email: data.email } });
        if (emailExists) {
            throw new Error('Email already used');
        }

        const hashedPassword = await argon2.hash(data.password);

        const user = User.create({
            email: data.email,
            name: data.name,
            password: hashedPassword,
            role: 0 // Default role : free user
        });

        await user.save();
        return "User created";
    }

    @Query(() => String)
    async login(@Arg("email") email: string, @Arg("password") password: string, @Ctx() context: any){
        try {

            if (process.env.JWT_SECRET_KEY === undefined) {
                throw new Error("NO JWT SECRET KEY DEFINED");
            }

            const user = await User.findOneByOrFail({email: email});
            if (await argon2.verify(user.password, password)) {
                const token = jwt.sign({email: email, role: user.role, id: user._id}, process.env.JWT_SECRET_KEY);
                context.res.setHeader("Set-Cookie", `token=${token}`);
                return "Login successful " + token; //TODO : remove token from response, it's here for test purpose
            } else {
                throw new Error("Login failed");
            }
        } catch (err) {
            return "Login failed";
        }
    }
}

export default UserResolver;

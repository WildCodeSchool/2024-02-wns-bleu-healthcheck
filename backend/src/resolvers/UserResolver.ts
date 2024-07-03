import "dotenv/config";

import { Resolver, Mutation, Arg } from 'type-graphql';
import { User } from '../entity/User';
import { RegisterInput, LoginInput } from '../types/UserInput';
import { AuthResponse } from '../types/AuthResponse';
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

    @Mutation(() => AuthResponse)
    async login(
        @Arg('data') data: LoginInput
    ): Promise<AuthResponse> {
        const user = await User.findOne({ where: { email: data.email } });
        if (!user) {
            throw new Error('User not found');
        }

        const valid = await argon2.verify(user.password, data.password);
        if (!valid) {
            throw new Error('Invalid password');
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role, name: user.name, email: user.email},
            process.env.JWT_SECRET_KEY as string,
            { expiresIn: '1d' }
        );

        return { token };
    }
}

export default UserResolver;

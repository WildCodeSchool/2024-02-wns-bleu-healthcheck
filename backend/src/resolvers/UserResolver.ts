import "dotenv/config";

import { Resolver, Mutation, Arg, Query, Ctx } from "type-graphql";
import { User } from "../entity/User";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { AppContext } from "../types/AppContext";
import { UserInfo } from "../types/UserInput";

@Resolver()
class UserResolver {
  @Mutation(() => String)
  async createUser(
    @Arg("email") email: string,
    @Arg("name") name: string,
    @Arg("password") password: string
  ): Promise<String> {
    // Check if email already exists
    const emailExists = await User.findOne({ where: { email: email } });
    if (emailExists) {
      throw new Error("Email already used");
    }

    const hashedPassword = await argon2.hash(password);

    const user = User.create({
      email: email,
      name: name,
      password: hashedPassword,
      role: 0, // Default role : free user
    });

        await user.save();
        return "User created";
    }

    @Mutation(() => String)
    async editUser(
        @Arg("email") email: string, @Arg("newEmail") newEmail: string, @Arg("name") name: string,
    ): Promise<String> {
        try {
            const user = await User.findOneOrFail({ where: { email: email } });
            user.email = newEmail;
            user.name = name;
            await user.save();
            return "User edited";
        } catch (err) {
            throw new Error("Failed to edit user");
        }
    }   

  @Query(() => String)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() context: any
  ) {
    try {
      if (process.env.JWT_SECRET_KEY === undefined) {
        throw new Error("NO JWT SECRET KEY DEFINED");
      }

      const user = await User.findOneByOrFail({ email: email });
      if (await argon2.verify(user.password, password)) {
        const token = jwt.sign(
          { email: email, role: user.role, userId: user._id },
          process.env.JWT_SECRET_KEY
        );
        context.res.setHeader("Set-Cookie", `token=${token}`);
        return "Login successful";
      } else {
        throw new Error("Login failed");
      }
    } catch (err) {
      return "Login failed";
    }
  }

  @Query(() => String)
  async logout(@Ctx() context: any) {
    context.res.setHeader("Set-Cookie", `token=; Secure, Max-Age=0`);
    return "Logged out";
  }

  @Query(() => UserInfo)
  async whoAmI(@Ctx() context: AppContext) {
    if (context.userId !== undefined) {
      const user = await User.findOneByOrFail({ _id: context.userId });
      return {
        email: user.email,
        role: user.role,
        name: user.name,
        isLoggedIn: true,
      };
    } else {
      return { isLoggedIn: false };
    }
  }
}

export default UserResolver;

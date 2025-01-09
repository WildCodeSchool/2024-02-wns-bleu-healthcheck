import "dotenv/config";
import { Resolver, Mutation, Arg, Query, Ctx } from "type-graphql";
import { User } from "../entity/User";
import { Group } from "../entity/Group";
import { In } from "typeorm";
import { AppContext } from "src/types/AppContext";

@Resolver()
class GroupResolver {
    // Create Group
    @Mutation(() => String)
    async createGroup(
        @Arg("name", () => String) name: string,
        @Arg("emails", () => [String]) emails: string[],
        @Ctx() context: AppContext
    ): Promise<String> {
        const userId = context.userId;
        // Vérifier si le groupe existe déjà
        const groupExists = await Group.findOne({
            where: {
                name: name,
                users: {
                    _id: userId,
                },
            },
            relations: ["users"],
        });
        if (groupExists) {
            throw new Error("Group name already used");
        }

        // Rechercher les utilisateurs correspondant aux emails fournis
        const users = await User.find({
            where: {
                email: In(emails),
            },
        });
        const foundEmails = users.map((user) => user.email);
        const notFoundEmails = emails.filter(
            (email) => !foundEmails.includes(email)
        );

        if (notFoundEmails.length > 0) {
            throw new Error(
                `Users with the following emails not found: ${notFoundEmails.join(
                    ", "
                )}`
            );
        }

        // Créer le groupe avec les utilisateurs trouvés
        const group = Group.create({
            name: name,
            users: users,
        });
        await group.save();
        return "Group created";
    }

    // Read Groups
    @Query(() => [Group])
    async getGroups(): Promise<Group[]> {
        return await Group.find({ relations: ["users"] });
    }

    @Query(() => Group, { nullable: true })
    async getGroupById(
        @Arg("id", () => Number) id: number
    ): Promise<Group | null> {
        const group = await Group.findOne({
            where: { _id: id },
            relations: ["users"],
        });
        if (!group) {
            throw new Error(`Group with id ${id} not found`);
        }
        return group;
    }

    // Read Groups by User
    @Query(() => [Group])
    async getGroupsByUser(
        @Arg("userId", () => Number) userId: number
    ): Promise<Group[]> {
        return await Group.createQueryBuilder("group")
            .innerJoin("group.users", "user", "user._id = :userId", { userId })
            .leftJoinAndSelect("group.users", "allUsers")
            .getMany();
    }

    // Update Group
    @Mutation(() => String)
    async updateGroup(
        @Arg("id", () => Number) id: number,
        @Arg("name", () => String, { nullable: true }) name?: string,
        @Arg("emails", () => [String], { nullable: true }) emails?: string[]
    ): Promise<String> {
        const group = await Group.findOne({
            where: { _id: id },
            relations: ["users"],
        });
        if (!group) {
            throw new Error("Group not found");
        }

        if (name) {
            group.name = name;
        }

        if (emails) {
            const users = await User.find({
                where: {
                    email: In(emails),
                },
            });
            const foundEmails = users.map((user) => user.email);
            const notFoundEmails = emails.filter(
                (email) => !foundEmails.includes(email)
            );

            if (notFoundEmails.length > 0) {
                throw new Error(
                    `Users with the following emails not found: ${notFoundEmails.join(
                        ", "
                    )}`
                );
            }

            group.users = users;
        }

        await group.save();
        return "Group updated";
    }

    // Delete Group
    @Mutation(() => String)
    async deleteGroup(@Arg("id", () => Number) id: number): Promise<String> {
        const group = await Group.findOne({ where: { _id: id } });
        if (!group) {
            throw new Error("Group not found");
        }

        await group.remove();
        return "Group deleted";
    }
}

export default GroupResolver;

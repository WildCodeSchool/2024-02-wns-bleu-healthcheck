import "dotenv/config";
import { Resolver, Mutation, Arg, Query } from "type-graphql";
import { User } from "../entity/User";
import { Group } from "../entity/Group";
import { In } from "typeorm";

@Resolver()
class GroupResolver {
  // Create Group
  @Mutation(() => String)
  async createGroup(
    @Arg("name", () => String) name: string,
    @Arg("emails", () => [String]) emails: string[]
  ): Promise<String> {
    // Vérifier si le groupe existe déjà
    const groupExists = await Group.findOne({ where: { name: name } });
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
    @Arg("id", () => String) id: string
  ): Promise<Group | null> {
    const group = await Group.findOne({
      where: { id },
      relations: ["users"],
    });
    if (!group) {
      throw new Error(`Group with id ${id} not found`);
    }
    return group;
  }

  // Update Group
  @Mutation(() => String)
  async updateGroup(
    @Arg("id", () => String) id: string,
    @Arg("name", () => String, { nullable: true }) name?: string,
    @Arg("emails", () => [String], { nullable: true }) emails?: string[]
  ): Promise<String> {
    const group = await Group.findOne({ where: { id }, relations: ["users"] });
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
  async deleteGroup(@Arg("id", () => String) id: string): Promise<String> {
    const group = await Group.findOne({ where: { id } });
    if (!group) {
      throw new Error("Group not found");
    }

    await group.remove();
    return "Group deleted";
  }
}

export default GroupResolver;

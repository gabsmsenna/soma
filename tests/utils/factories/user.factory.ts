import { faker } from "@faker-js/faker";
import type { User } from "@prisma/client";

export type UserFactoryInput = Partial<User>;

export function createUserFactory(overrides?: UserFactoryInput): User {
  return {
    id: overrides?.id ?? faker.string.uuid(),
    name: overrides?.name ?? faker.person.fullName(),
    email: overrides?.email ?? faker.internet.email(),
    password: overrides?.password ?? faker.internet.password(),
    cpf: overrides?.cpf ?? faker.string.numeric(11),
    createdAt: overrides?.createdAt ?? faker.date.past(),
    updatedAt: overrides?.updatedAt ?? faker.date.recent(),
  };
}

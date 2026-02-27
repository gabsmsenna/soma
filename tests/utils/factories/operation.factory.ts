import { faker } from "@faker-js/faker";
import type { Operation } from "@prisma/client";

export type OperationFactoryInput = Partial<Operation>;

export function createOperationFactory(
  overrides?: OperationFactoryInput,
): Operation {
  return {
    id: overrides?.id ?? faker.string.uuid(),
    name: overrides?.name ?? faker.company.name(),
    userId: overrides?.userId ?? faker.string.uuid(),
    createdAt: overrides?.createdAt ?? faker.date.past(),
    updatedAt: overrides?.updatedAt ?? faker.date.recent(),
  };
}

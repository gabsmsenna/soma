import { faker } from "@faker-js/faker";
import type { Project } from "@prisma/client";
import { Decimal } from "decimal.js";

export type ProjectFactoryInput = Partial<Project>;

export function createProjectFactory(overrides?: ProjectFactoryInput): Project {
  return {
    id: overrides?.id ?? faker.string.uuid(),
    name: overrides?.name ?? faker.commerce.productName(),
    isPaid: overrides?.isPaid ?? false,
    paidAt: overrides?.paidAt ?? null,
    operationId: overrides?.operationId ?? faker.string.uuid(),
    freelancerCutPercentage:
      overrides?.freelancerCutPercentage ??
      new Decimal(faker.number.float({ min: 5, max: 20, fractionDigits: 2 })),
    isActive: overrides?.isActive ?? true,
    createdAt: overrides?.createdAt ?? faker.date.past(),
    updatedAt: overrides?.updatedAt ?? faker.date.recent(),
  };
}

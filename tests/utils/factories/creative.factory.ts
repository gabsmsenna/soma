import { faker } from "@faker-js/faker";
import type { Creative } from "@prisma/client";
import { Decimal } from "decimal.js";

export type CreativeFactoryInput = Partial<Creative>;

export function createCreativeFactory(
  overrides?: CreativeFactoryInput,
): Creative {
  return {
    id: overrides?.id ?? faker.string.uuid(),
    name: overrides?.name ?? faker.commerce.productName(),
    totalProfit:
      overrides?.totalProfit ??
      new Decimal(
        faker.number.float({ min: 100, max: 10000, fractionDigits: 2 }),
      ),
    freelancerCut:
      overrides?.freelancerCut ??
      new Decimal(
        faker.number.float({ min: 10, max: 1000, fractionDigits: 2 }),
      ),
    isPaid: overrides?.isPaid ?? false,
    paidAt: overrides?.paidAt ?? null,
    projectId: overrides?.projectId ?? faker.string.uuid(),
    createdAt: overrides?.createdAt ?? faker.date.past(),
    updatedAt: overrides?.updatedAt ?? faker.date.recent(),
  };
}

import { expect } from "vitest";

export function assertProblemDetails(
  response: Response,
  expectedStatus: number,
  expectedType?: string,
) {
  expect(response.status).toBe(expectedStatus);
  expect(response.headers.get("Content-Type")).toBe("application/problem+json");

  if (expectedType) {
    return response.json().then((body) => {
      expect(body.type).toContain(expectedType);
      expect(body.status).toBe(expectedStatus);
      expect(body.title).toBeDefined();
      expect(body.detail).toBeDefined();
      return body;
    });
  }

  return response.json();
}

export function assertSuccessResponse(
  response: Response,
  expectedStatus = 200,
) {
  expect(response.status).toBe(expectedStatus);
  expect(response.ok).toBe(true);
  return response.json();
}

export function assertValidationError(
  response: Response,
  expectedFields?: string[],
) {
  expect(response.status).toBe(400);

  return response.json().then((body) => {
    expect(body.type).toContain("validation-error");

    if (expectedFields) {
      expect(body.extensions?.errors).toBeDefined();
      const errorFields = Object.keys(body.extensions.errors);
      for (const field of expectedFields) {
        expect(errorFields).toContain(field);
      }
    }

    return body;
  });
}

export function assertUnauthorized(response: Response) {
  return assertProblemDetails(response, 401, "unauthorized");
}

export function assertNotFound(response: Response) {
  return assertProblemDetails(response, 404, "not-found");
}

export function assertConflict(response: Response) {
  return assertProblemDetails(response, 409, "conflict");
}

export function assertDateString(value: unknown): asserts value is string {
  expect(typeof value).toBe("string");
  expect(new Date(value as string).toString()).not.toBe("Invalid Date");
}

export function assertUUID(value: unknown): asserts value is string {
  expect(typeof value).toBe("string");
  expect(value).toMatch(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  );
}

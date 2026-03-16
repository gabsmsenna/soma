import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

vi.mock("@/services/auth.service", () => ({
  verifyToken: vi.fn(),
}));

describe("getServerSession", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns userId and email when valid cookie exists", async () => {
    const { cookies } = await import("next/headers");
    const { verifyToken } = await import("@/services/auth.service");

    vi.mocked(cookies).mockReturnValue({
      get: vi.fn().mockReturnValue({ value: "valid.jwt.token" }),
    } as unknown as Awaited<ReturnType<typeof cookies>>);

    vi.mocked(verifyToken).mockResolvedValue({
      userId: "user-123",
      email: "test@example.com",
      name: "Test User",
    });

    const { getServerSession } = await import("@/lib/session");
    const session = await getServerSession();

    expect(session).toEqual({
      userId: "user-123",
      email: "test@example.com",
      name: "Test User",
    });
    expect(verifyToken).toHaveBeenCalledWith("valid.jwt.token");
  });

  it("returns null when no auth_token cookie exists", async () => {
    const { cookies } = await import("next/headers");

    vi.mocked(cookies).mockReturnValue({
      get: vi.fn().mockReturnValue(undefined),
    } as unknown as Awaited<ReturnType<typeof cookies>>);

    const { getServerSession } = await import("@/lib/session");
    const session = await getServerSession();

    expect(session).toBeNull();
  });

  it("returns null when token verification fails", async () => {
    const { cookies } = await import("next/headers");
    const { verifyToken } = await import("@/services/auth.service");

    vi.mocked(cookies).mockReturnValue({
      get: vi.fn().mockReturnValue({ value: "invalid.token" }),
    } as unknown as Awaited<ReturnType<typeof cookies>>);

    vi.mocked(verifyToken).mockRejectedValue(new Error("invalid token"));

    const { getServerSession } = await import("@/lib/session");
    const session = await getServerSession();

    expect(session).toBeNull();
  });
});

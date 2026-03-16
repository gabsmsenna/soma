import { afterEach, describe, expect, it, vi } from "vitest";
import { loginUser, registerUser } from "@/lib/auth-api";

describe("loginUser", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("resolves with { user, token } on 200", async () => {
    const mockData = {
      user: { id: "1", email: "test@example.com" },
      token: "jwt.token.here",
    };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => mockData }),
    );

    const result = await loginUser("test@example.com", "password123");

    expect(result).toEqual(mockData);
  });

  it("throws the RFC 9457 problem object on 401", async () => {
    const problem = {
      type: "https://soma.api/problems/invalid-credentials",
      title: "Credenciais inválidas",
      status: 401,
      detail: "E-mail ou senha incorretos",
    };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, json: async () => problem }),
    );

    await expect(
      loginUser("test@example.com", "wrongpassword"),
    ).rejects.toEqual(problem);
  });
});

describe("registerUser", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("resolves with { user, token } on 201", async () => {
    const mockData = {
      user: { id: "2", email: "new@example.com" },
      token: "jwt.token.here",
    };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => mockData }),
    );

    const result = await registerUser(
      "New User",
      "new@example.com",
      "password123",
      "12345678901",
    );

    expect(result).toEqual(mockData);
  });

  it("throws the RFC 9457 problem object on 409 conflict", async () => {
    const problem = {
      type: "https://soma.api/problems/email-already-exists",
      title: "Conflito",
      status: 409,
      detail: "E-mail já cadastrado",
    };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, json: async () => problem }),
    );

    await expect(
      registerUser(
        "New User",
        "existing@example.com",
        "password123",
        "12345678901",
      ),
    ).rejects.toEqual(problem);
  });
});

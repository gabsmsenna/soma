import { TextDecoder, TextEncoder } from "node:util";
import dotenv from "dotenv";
import { afterAll } from "vitest";
import { teardownTestDatabase } from "./test-db";

dotenv.config({ path: ".env.test" }); // Polyfill TextEncoder and TextDecoder for jose library
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;

// After each test file: close every pool that may have been opened so that
// Supabase session-pooler slots are released before the next file starts.
afterAll(async () => {
  // Close test-db's pool (handles leaks if a test's own afterAll missed it).
  await teardownTestDatabase();

  // Close the @/lib/prisma singleton pool.
  if (globalThis.prismaGlobal) {
    await globalThis.prismaGlobal.$disconnect();
    globalThis.prismaGlobal = undefined;
  }
  if (globalThis.prismaPoolGlobal) {
    await globalThis.prismaPoolGlobal.end();
    globalThis.prismaPoolGlobal = undefined;
  }
});

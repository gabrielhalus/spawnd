/* eslint-disable node/no-process-env */
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { envSchema } from "@spawnd/shared/schemas/env";

const originalEnv = { ...process.env };

beforeEach(() => {
  process.env = { ...originalEnv };
});

afterEach(() => {
  process.env = { ...originalEnv };
});

describe("env schema validation", () => {
  it("passes with valid environment variables", () => {
    process.env.NODE_ENV = "production";
    process.env.DATABASE_URL = "postgres://user:pass@localhost/db";
    process.env.JWT_SECRET = "secret";

    const result = envSchema.parse(process.env);
    expect(result.NODE_ENV).toBe("production");
  });

  it("fails when NODE_ENV is missing", () => {
    delete process.env.NODE_ENV;
    process.env.DATABASE_URL = "sqlite://file.db";
    process.env.JWT_SECRET = "secret";

    expect(() => envSchema.parse(process.env)).toThrow(/NODE_ENV/);
  });

  it("fails when DATABASE_URL is missing", () => {
    process.env.NODE_ENV = "development";
    delete process.env.DATABASE_URL;
    process.env.JWT_SECRET = "secret";

    expect(() => envSchema.parse(process.env)).toThrow(/DATABASE_URL/);
  });

  it("fails when JWT_SECRET is missing", () => {
    process.env.NODE_ENV = "test";
    process.env.DATABASE_URL = "sqlite://file.db";
    delete process.env.JWT_SECRET;

    expect(() => envSchema.parse(process.env)).toThrow(/JWT_SECRET/);
  });

  it("fails when NODE_ENV is invalid", () => {
    process.env.NODE_ENV = "staging"; // invalid enum
    process.env.DATABASE_URL = "sqlite://file.db";
    process.env.JWT_SECRET = "secret";

    expect(() => envSchema.parse(process.env)).toThrow(/Invalid enum value/);
  });

  it("fails when DATABASE_URL is empty", () => {
    process.env.NODE_ENV = "test";
    process.env.DATABASE_URL = "";
    process.env.JWT_SECRET = "secret";

    expect(() => envSchema.parse(process.env)).toThrow(/DATABASE_URL/);
  });

  it("fails when JWT_SECRET is empty", () => {
    process.env.NODE_ENV = "development";
    process.env.DATABASE_URL = "sqlite://file.db";
    process.env.JWT_SECRET = "";

    expect(() => envSchema.parse(process.env)).toThrow(/JWT_SECRET/);
  });

  it("passes in NODE_ENV=test with valid env", () => {
    process.env.NODE_ENV = "test";
    process.env.DATABASE_URL = "sqlite://memory";
    process.env.JWT_SECRET = "testsecret";

    const result = envSchema.parse(process.env);
    expect(result.NODE_ENV).toBe("test");
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import bcrypt from "bcrypt";
import User from "@/models/user";

// Mock server-only APIs that auth.ts depends on
const redirectMock = vi.fn();
vi.mock("next/navigation", () => ({
  redirect: (...args: unknown[]) => redirectMock(...args),
}));

const cookieStore = {
  set: vi.fn(),
  delete: vi.fn(),
  get: vi.fn(),
};
vi.mock("next/headers", () => ({
  cookies: async () => cookieStore,
}));

// dbConnect is a no-op in tests: test/setup.ts already connects mongoose
// to the in-memory mongodb instance for the whole suite.
vi.mock("@/app/lib/mongodb", () => ({
  default: vi.fn(async () => {}),
}));

vi.mock("@/app/lib/session", () => ({
  createSession: vi.fn(),
  decrypt: vi.fn(async (token: string | undefined) => {
    if (token === "valid-token") return { userId: "user-123" };
    return undefined;
  }),
}));

import { login, signup, logout, getCurrentUser } from "@/app/actions/auth";
import { createSession } from "@/app/lib/session";

beforeEach(() => {
  redirectMock.mockClear();
  cookieStore.set.mockClear();
  cookieStore.delete.mockClear();
  cookieStore.get.mockClear();
  vi.mocked(createSession).mockClear();
});

describe("auth: login", () => {
  it("成功登入時建立 session 並 redirect", async () => {
    const hashed = await bcrypt.hash("password123", 10);
    await User.create({ username: "testuser1", password: hashed });

    const result = await login(
      {},
      { username: "testuser1", password: "password123" },
    );

    expect(createSession).toHaveBeenCalled();
    expect(redirectMock).toHaveBeenCalledWith("/");
    expect(result).toBeUndefined();
  });

  it("密碼錯誤時回傳失敗訊息，不建立 session", async () => {
    const hashed = await bcrypt.hash("correctpass", 10);
    await User.create({ username: "testuser2", password: hashed });

    const result = await login(
      {},
      { username: "testuser2", password: "wrongpass" },
    );

    expect(result?.message).toMatch(/fail/i);
    expect(createSession).not.toHaveBeenCalled();
    expect(redirectMock).not.toHaveBeenCalled();
  });

  it("使用者不存在時回傳失敗訊息", async () => {
    const result = await login(
      {},
      { username: "nouser1", password: "whatever1" },
    );

    expect(result?.message).toMatch(/fail/i);
    expect(createSession).not.toHaveBeenCalled();
  });

  it("表單驗證失敗（密碼太短）回傳 error", async () => {
    const result = await login({}, { username: "shortpw", password: "12" });

    expect(result?.error?.password).toBeDefined();
    expect(createSession).not.toHaveBeenCalled();
  });
});

describe("auth: signup", () => {
  it("成功註冊建立使用者並 redirect 到 /login", async () => {
    await signup(
      {},
      {
        username: "newuser1",
        password: "password123",
        invite_code: process.env.INVITE_CODE!,
      },
    );

    const user = await User.findOne({ username: "newuser1" });
    expect(user).not.toBeNull();
    expect(redirectMock).toHaveBeenCalledWith("/login");
  });

  it("invite_code 錯誤時驗證失敗，不建立使用者", async () => {
    const result = await signup(
      {},
      {
        username: "newuser2",
        password: "password123",
        invite_code: "wrong-code",
      },
    );

    expect(result?.error?.invite_code).toBeDefined();
    const user = await User.findOne({ username: "newuser2" });
    expect(user).toBeNull();
  });
});

describe("auth: logout", () => {
  it("刪除 session cookie 並 redirect 到 /login", async () => {
    await logout();

    expect(cookieStore.delete).toHaveBeenCalledWith("session");
    expect(redirectMock).toHaveBeenCalledWith("/login");
  });
});

describe("auth: getCurrentUser", () => {
  it("有效 session cookie 回傳 payload", async () => {
    cookieStore.get.mockReturnValue({ value: "valid-token" });

    const user = await getCurrentUser();

    expect(user?.userId).toBe("user-123");
  });

  it("無 session cookie 回傳 undefined", async () => {
    cookieStore.get.mockReturnValue(undefined);

    const user = await getCurrentUser();

    expect(user).toBeUndefined();
  });
});

import { describe, it, expect, vi } from "vitest";

const cookieStore = { set: vi.fn(), get: vi.fn(), delete: vi.fn() };
vi.mock("next/headers", () => ({
  cookies: async () => cookieStore,
}));

import { encrypt, decrypt, createSession } from "@/app/lib/session";

describe("session: encrypt/decrypt", () => {
  it("decrypt 能還原 encrypt 產生的有效 token", async () => {
    const token = await encrypt({ userId: "abc123", expiresAt: new Date() });
    const payload = await decrypt(token);

    expect(payload?.userId).toBe("abc123");
  });

  it("decrypt 無效 token 回傳 undefined，不拋錯", async () => {
    const payload = await decrypt("this-is-not-a-valid-jwt");

    expect(payload).toBeUndefined();
  });

  it("decrypt 空 token 回傳 undefined", async () => {
    const payload = await decrypt(undefined);

    expect(payload).toBeUndefined();
  });
});

describe("session: createSession", () => {
  it("設定 session cookie，內容包含 httpOnly/secure/正確 userId", async () => {
    cookieStore.set.mockClear();

    await createSession("user-456");

    expect(cookieStore.set).toHaveBeenCalledTimes(1);
    const [name, token, options] = cookieStore.set.mock.calls[0];
    expect(name).toBe("session");
    expect(options.httpOnly).toBe(true);
    expect(options.secure).toBe(true);

    const payload = await decrypt(token);
    expect(payload?.userId).toBe("user-456");
  });
});

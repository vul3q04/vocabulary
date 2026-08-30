import { describe, it, expect, vi, beforeEach } from "vitest";
import mongoose from "mongoose";
import Word from "@/models/word";

vi.mock("@/app/lib/mongodb", () => ({
  default: vi.fn(async () => {}),
}));

const getCurrentUserMock = vi.fn();
vi.mock("@/app/actions/auth", () => ({
  getCurrentUser: () => getCurrentUserMock(),
}));

import { GET, POST, DELETE } from "@/app/api/word/route";

const AUTHED_USER_ID = new mongoose.Types.ObjectId().toString();

beforeEach(() => {
  getCurrentUserMock.mockReset();
});

function jsonRequest(body: unknown) {
  return new Request("http://localhost/api/word", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

describe("word API: unauthorized", () => {
  it("GET 未授權回 401", async () => {
    getCurrentUserMock.mockResolvedValue(undefined);
    const res = await GET();
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.success).toBe(false);
  });

  it("POST 未授權回 401", async () => {
    getCurrentUserMock.mockResolvedValue(undefined);
    const res = await POST(jsonRequest({ name: "hello" }));
    expect(res.status).toBe(401);
  });

  it("DELETE 未授權回 401", async () => {
    getCurrentUserMock.mockResolvedValue(undefined);
    const res = await DELETE(jsonRequest({ id: AUTHED_USER_ID }));
    expect(res.status).toBe(401);
  });
});

describe("word API: authorized", () => {
  beforeEach(() => {
    getCurrentUserMock.mockResolvedValue({ userId: AUTHED_USER_ID });
  });

  it("POST 新增單字後 GET 能查到自己的單字", async () => {
    const postRes = await POST(jsonRequest({ name: "apple" }));
    expect(postRes.status).toBe(200);
    const postBody = await postRes.json();
    expect(postBody.success).toBe(true);

    const getRes = await GET();
    const getBody = await getRes.json();
    expect(getBody.success).toBe(true);
    expect(getBody.data.some((w: { name: string }) => w.name === "apple")).toBe(
      true,
    );
  });

  it("GET 只回傳目前使用者的單字，不含他人單字", async () => {
    const otherUserId = new mongoose.Types.ObjectId().toString();
    await Word.create({ name: "others-word", user_id: otherUserId });
    await Word.create({ name: "my-word", user_id: AUTHED_USER_ID });

    const res = await GET();
    const body = await res.json();
    const names = body.data.map((w: { name: string }) => w.name);
    expect(names).toContain("my-word");
    expect(names).not.toContain("others-word");
  });

  it("DELETE 刪除自己的單字後查不到", async () => {
    const word = await Word.create({
      name: "to-delete",
      user_id: AUTHED_USER_ID,
    });

    const delRes = await DELETE(jsonRequest({ id: word._id.toString() }));
    expect(delRes.status).toBe(200);

    const found = await Word.findById(word._id);
    expect(found).toBeNull();
  });

  it("DELETE 不能刪除他人的單字", async () => {
    const otherUserId = new mongoose.Types.ObjectId().toString();
    const word = await Word.create({
      name: "not-mine",
      user_id: otherUserId,
    });

    await DELETE(jsonRequest({ id: word._id.toString() }));

    const found = await Word.findById(word._id);
    expect(found).not.toBeNull();
  });
});

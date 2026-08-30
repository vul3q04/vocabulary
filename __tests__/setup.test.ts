import { describe, it, expect } from "vitest";
import mongoose from "mongoose";

describe("01 setup: mongodb-memory-server", () => {
  it("connects to in-memory mongodb", () => {
    expect(mongoose.connection.readyState).toBe(1);
  });
});

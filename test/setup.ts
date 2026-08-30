import { beforeAll, afterAll, afterEach, vi } from "vitest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

process.env.SESSION_SECRET = process.env.SESSION_SECRET || "test-secret-key-for-vitest-only";
process.env.INVITE_CODE = process.env.INVITE_CODE || "test-invite-code";

let mongod: MongoMemoryServer;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri, { dbName: "vocabulary-test" });
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
  vi.restoreAllMocks();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

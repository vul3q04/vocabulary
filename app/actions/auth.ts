"use server";

import dbConnect from "@/app/lib/mongodb";
import User from "@/models/user";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createSession, decrypt } from "@/app/lib/session";
import * as z from "zod";

export type typeLoginState = {
  username: string;
  password: string;
};

export type typeLoginErrorState = {
  error?: {
    username?: string[];
    password?: string[];
  };
  message?: string;
};

const schemaLogin = z.object({
  username: z.string().min(6).max(20),
  password: z.string().min(6).max(20),
});
export async function login(
  state: typeLoginErrorState,
  payload: typeLoginState,
): Promise<typeLoginErrorState> {
  // 1. Validate form fields
  const valid = schemaLogin.safeParse(payload);
  if (!valid.success) {
    return {
      error: z.flattenError(valid.error).fieldErrors,
    };
  }

  // 2. Prepare data for insertion into database
  const username = valid.data.username;
  const password = valid.data.password;

  // 3. Insert the user into the database or call an Auth Library's API

  await dbConnect();
  const user = await User.findOne({ username });

  if (!user) {
    return {
      message: "Login fail. Please check your username or password",
    };
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return {
      message: "Login fail. Please check your username or password",
    };
  }
  // Current steps:
  // 4. Create user session
  await createSession(user._id.toString());
  // 5. Redirect user
  redirect("/");
}

const schemaSignup = z.object({
  username: z.string().min(6).max(20),
  password: z.string().min(6).max(20),
  invite_code: z.literal([process.env.INVITE_CODE]),
});
export async function signup(
  state: typeLoginErrorState & { error?: { invite_code?: string[] } },
  payload: typeLoginState & { invite_code: string },
): Promise<typeLoginErrorState & { error?: { invite_code?: string[] } }> {
  // 1. Validate form fields
  const valid = schemaSignup.safeParse(payload);
  if (!valid.success) {
    return {
      error: z.flattenError(valid.error).fieldErrors,
    };
  }

  const { username, password } = valid.data;

  await dbConnect();
  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({ username, password: hashedPassword });

  redirect("/login");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  redirect("/login");
}

export async function getCurrentUser() {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);
  return session;
}

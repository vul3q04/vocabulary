"use server";

import dbConnect from "@/app/lib/mongodb";
import User from "@/models/user";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createSession, decrypt } from "@/app/lib/session";

type FormState =
  | {
      errors?: {
        username?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

export async function login(state: FormState, formData: FormData) {
  // 1. Validate form fields
  // ...

  // 2. Prepare data for insertion into database
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  // 3. Insert the user into the database or call an Auth Library's API

  await dbConnect();
  const user = await User.findOne({ username });

  if (!user) {
    return {
      errors: {
        username: ["An error occurred while creating your account."],
      },
    };
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return {
      errors: {
        password: ["Invalid password."],
      },
    };
  }
  // Current steps:
  // 4. Create user session
  await createSession(user._id.toString());
  // 5. Redirect user
  redirect("/");
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

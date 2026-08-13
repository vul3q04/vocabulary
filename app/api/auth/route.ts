import dbConnect from "@/app/lib/mongodb";
import User from "@/models/user";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  const { username, password, invite_code } = await request.json();
  if (invite_code !== process.env.INVITE_CODE) {
    return Response.json({
      success: false,
      message: "Invalid invite code",
    });
  }

  await dbConnect();
  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({ username, password: hashedPassword });

  return Response.json({
    success: true,
    message: "User created successfully",
  });
}

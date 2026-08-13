"use server";

import "server-only";
import dbConnect from "@/app/lib/mongodb";
import Word from "@/models/word";
import { getCurrentUser } from "@/app/actions/auth";
import mongoose from "mongoose";

export async function GET() {
  const currentUser = await getCurrentUser();
  if (!currentUser?.userId) {
    return Response.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 },
    );
  }

  await dbConnect();
  const words = await Word.find({
    user_id: currentUser?.userId,
  }).lean();

  return Response.json({
    success: true,
    data: words,
  });
}

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser?.userId) {
    return Response.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 },
    );
  }

  await dbConnect();
  const { name } = await request.json();
  await Word.create({ name, user_id: currentUser?.userId });

  return Response.json({
    success: true,
    message: "Word added successfully",
  });
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  const currentUser = await getCurrentUser();
  if (!currentUser?.userId) {
    return Response.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 },
    );
  }

  await dbConnect();
  await Word.deleteOne({
    _id: new mongoose.Types.ObjectId(id),
    user_id: currentUser?.userId,
  });

  return Response.json({
    success: true,
    message: "Word deleted successfully",
  });
}

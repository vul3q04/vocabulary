import dbConnect from "@/lib/mongodb";
import Word from "@/models/word";

export async function GET() {
  await dbConnect();
  const words = await Word.find();

  return Response.json({
    success: true,
    data: words,
  });
}


export async function POST(request: Request) {
  await dbConnect();
  const { name } = await request.json();
  await Word.create({ name });

  return Response.json({
    success: true,
    message: "Word added successfully",
  });
}

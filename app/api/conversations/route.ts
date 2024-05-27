import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface ApiResponse {
  message?: string;
  messages?: MessageType[];
}

export async function GET(
  req: NextRequest,
  res: NextResponse,
): Promise<NextResponse<ApiResponse>> {
  const searchParams = req.nextUrl.searchParams;
  const senderId = searchParams.get("senderId") as string;
  const receiverId = searchParams.get("receiverId") as string;

  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: senderId, receiverId: receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
    });
    if (messages) {
      return NextResponse.json({ messages }, { status: 200 });
    } else {
      return NextResponse.json(
        {
          message: "someting went wrong!",
        },
        { status: 404 },
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        message: "someting went wrong!",
      },
      { status: 500 },
    );
  }
}

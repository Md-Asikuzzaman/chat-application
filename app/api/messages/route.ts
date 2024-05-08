import prisma from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface ApiResponse {
  message?: string;
  messages?: object[];
}

export async function GET(): Promise<NextResponse<ApiResponse>> {
  try {
    const messages = await prisma.message.findMany();

    return NextResponse.json({ messages });
  } catch (error) {
    return NextResponse.json(
      {
        message: "someting went wrong!",
      },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  res: NextResponse
): Promise<NextResponse<ApiResponse>> {
  try {
    const message = await req.json();

    await prisma.message.create({
      data: message,
    });

    return NextResponse.json({ message: "message sent" }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "someting went wrong!",
      },
      { status: 500 }
    );
  }
}

import prisma from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface ApiResponse {
  message?: string;
  users?: object[];
}

export async function GET(): Promise<NextResponse<ApiResponse>> {
  try {
    const users = await prisma.user.findMany();

    return NextResponse.json({ users });
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
    const user = await req.json();

    await prisma.user.create({
      data: user,
    });

    return NextResponse.json({ message: "user created" }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "someting went wrong!",
      },
      { status: 500 }
    );
  }
}

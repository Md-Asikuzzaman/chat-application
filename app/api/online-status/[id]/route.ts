interface ApiResponse {
  onlineStatus?: UserType;
  message?: string;
}

import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse>> {
  const { status } = await req.json();

  console.log(status);
  try {
    const onlineStatus = await prisma.user.update({
      where: {
        id: params.id,
      },
      data: {
        status,
      },
    });

    return NextResponse.json({ onlineStatus }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "someting went wrong!",
      },
      { status: 500 }
    );
  }
}

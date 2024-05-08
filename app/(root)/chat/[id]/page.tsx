"use client";

import { NextPage } from "next";

import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";

import ChatBoardHeader from "@/app/components/section/ChatBoardHeader";
import ChatBoard from "@/app/components/section/ChatBoard";
import ChatBoradForm from "@/app/components/section/ChatBoradForm";

interface Props {}

const Page: NextPage<Props> = ({}) => {
  // Get sender id
  const { data } = useSession();
  const user = data?.user as UserType;
  const senderId = user?.id;

  // Get receiver id
  const { id } = useParams();
  const receiverId = id as string;

  return (
    <div className="flex-1 relative flex flex-col h-full">
      {/* chat board header */}
      <ChatBoardHeader receiverId={receiverId} />
      {/* chat board */}
      <ChatBoard
        senderId={senderId}
        receiverId={receiverId}
        scrollRef={""}
        scrollToBottom={""}
      />

      {/* chat board form */}
      <ChatBoradForm senderId={senderId} receiverId={receiverId} />
    </div>
  );
};

export default Page;

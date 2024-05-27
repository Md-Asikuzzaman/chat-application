"use client";

import { useRef } from "react";

import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";

import ChatBoardHeader from "@/app/components/section/ChatBoardHeader";
import ChatBoard from "@/app/components/section/ChatBoard";
import ChatBoradForm from "@/app/components/section/ChatBoradForm";
import LogOutButton from "@/app/components/ui/LogOutButton";

const Page = () => {
  // Get sender id
  const { data } = useSession();
  const user = data?.user as UserType;
  const senderId = user?.id;

  // Get receiver id
  const { id } = useParams();
  const receiverId = id as string;

  // Working with div ref for auto scrolling
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scrolling funciton
  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative flex h-[100vh] flex-1 flex-col">
      {/* chat board header */}
      <ChatBoardHeader receiverId={receiverId} />

      {/* chat board */}
      <ChatBoard
        senderId={senderId}
        receiverId={receiverId}
        scrollRef={scrollRef}
        scrollToBottom={scrollToBottom}
      />

      {/* chat board form */}
      <ChatBoradForm
        senderId={senderId}
        receiverId={receiverId}
        scrollToBottom={scrollToBottom}
      />

      {/* logout button */}
      <LogOutButton />
    </div>
  );
};

export default Page;

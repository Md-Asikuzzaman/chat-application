"use client";

import ChatBoard from "@/app/components/section/ChatBoard";
import ChatBoardHeader from "@/app/components/section/ChatBoardHeader";
import { NextPage } from "next";
import { BsFillSendFill } from "react-icons/bs";
import { MdEmojiEmotions } from "react-icons/md";
import { TiAttachment } from "react-icons/ti";

import { useSession } from "next-auth/react";

import { useParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRef, useState } from "react";

interface Props {}

interface UType {
  email: string;
  id: string;
}

const Page: NextPage<Props> = ({}) => {
  const [message, setMessage] = useState<string>("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data } = useSession();
  const { id } = useParams();

  const queryClient = useQueryClient();

  const user = data?.user as UType;

  const receiverId = id as string;
  const senderId = user?.id;

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  // send message
  const { mutate } = useMutation({
    mutationKey: ["send_message"],
    mutationFn: async (data: object) => {
      const { data: message } = await axios.post("/api/messages", data, {
        baseURL: process.env.NEXTAUTH_URL,
      });
      return message;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["fetch_messages"],
      });

      scrollToBottom();
    },
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log(message);

    mutate({
      message,
      senderId,
      receiverId,
    });

    setMessage("");
  };

  return (
    <div className="flex-1 relative flex flex-col h-full">
      {/* header */}
      <ChatBoardHeader receiverId={receiverId} />
      {/* chat board */}
      <ChatBoard
        senderId={senderId}
        receiverId={receiverId}
        scrollRef={scrollRef}
      />

      {/* message send input */}
      <form onSubmit={handleSubmit} className="absolute w-full bottom-5">
        <div className="flex bg-white py-3 px-5 items-center gap-3 rounded-full">
          <TiAttachment className="shrink-0" size={30} />
          <input
            className="flex-1 py-3 outline-none outline-0"
            type="text"
            placeholder="Type a message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit" hidden className="hidden">
            send
          </button>
          <MdEmojiEmotions className="shrink-0" size={22} />
          <BsFillSendFill className="shrink-0" size={22} />
        </div>
      </form>
    </div>
  );
};

export default Page;

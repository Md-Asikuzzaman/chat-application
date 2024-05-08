"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { NextPage } from "next";

interface Props {
  senderId: string;
  receiverId: string;
  scrollRef: any;
}
interface queryType {
  id: string;
  message: string;
  senderId: string;
  receiverId: string;
  createdAt: Date;
  updatedAt: Date;
}

const ChatBoard: NextPage<Props> = ({ receiverId, senderId, scrollRef }) => {
  const { data: messages } = useQuery<queryType[]>({
    queryKey: ["fetch_messages"],
    queryFn: async () => {
      const { data } = await axios.get("/api/messages", {
        baseURL: process.env.NEXTAUTH_URL,
      });

      return data.messages;
    },

    refetchInterval: 1000,
  });

  const filteredMessage = messages?.filter(
    (message) =>
      (message.senderId === senderId && message.receiverId === receiverId) ||
      (message.receiverId === senderId && message.senderId === receiverId)
  );

  return (
    <div
      className="flex flex-col gap-3 h-[calc(100vh-230px)] overflow-y-scroll px-4"
      ref={scrollRef}
    >
      {filteredMessage?.map((data, i) => (
        <div
          key={i}
          className={`flex ${
            senderId === data.senderId ? "justify-end" : "justify-start"
          }`}
        >
          <p
            className={`inline-block py-3 px-4 rounded-xl text-white max-w-[90%] ${
              senderId === data.senderId ? "bg-violet-500" : "bg-zinc-500"
            }`}
          >
            {data.message}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ChatBoard;
